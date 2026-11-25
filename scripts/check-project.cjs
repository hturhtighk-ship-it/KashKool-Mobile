'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const failures = [];
const checks = [];

function pass(label) {
  checks.push(label);
}

function fail(label) {
  failures.push(label);
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

const packageJson = JSON.parse(read('package.json') || '{}');
const indexHtml = read('index.html');
const manifest = JSON.parse(read('kashkool.webmanifest') || '{}');
const cloudJs = read('assets/js/18-cloud-accounts-v1.js');
const notificationJs = read('assets/js/99-notifications.js');
const coreJs = read('assets/js/01-app-core.js');
const mainJs = read('desktop/main.cjs');
const preloadJs = read('desktop/preload.cjs');

if (packageJson.main === 'desktop/main.cjs') pass('Electron entry point is set');
else fail('package.json main must point to desktop/main.cjs');

const windowsTargets = packageJson.build?.win?.target || [];
if (windowsTargets.length === 1 && windowsTargets[0]?.target === 'nsis') {
  pass('Default Windows build targets the NSIS installer only');
} else {
  fail('Default Windows build must target NSIS only; keep Portable out of the main build');
}

if (packageJson.devDependencies?.electron && packageJson.devDependencies?.['electron-builder']) {
  pass('Electron and electron-builder are declared as project development dependencies');
} else {
  fail('Electron build tools are missing from devDependencies');
}

if (manifest.name && manifest.start_url) pass('Web manifest is valid JSON');
else fail('Web manifest is missing required fields');

const localReferences = [
  ...indexHtml.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi),
  ...indexHtml.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)
];
for (const match of localReferences) {
  const ref = match[1];
  if (/^(?:https?:|data:|mailto:|#)/i.test(ref)) continue;
  const target = path.resolve(root, ref);
  if (!target.startsWith(root + path.sep) && target !== root) {
    fail(`HTML reference escapes project folder: ${ref}`);
    continue;
  }
  if (!fs.existsSync(target)) fail(`HTML points to a missing local file: ${ref}`);
}
if (!failures.some((item) => item.includes('HTML'))) pass('All local HTML references exist');

const requiredFirebaseValues = [
  'AIzaSyAtO4nHCQNO0uw70t2UUB6s2q8gMzEVTQU',
  'kashkool-cloud.firebaseapp.com',
  'kashkool-cloud',
  '1044246708324',
  '1:1044246708324:web:c656da387dd2bb32d75f71',
  'G-SKSQ6GZC8X'
];
if (requiredFirebaseValues.every((value) => cloudJs.includes(value))) {
  pass('Shared Firebase web configuration is embedded');
} else {
  fail('Shared Firebase configuration is incomplete');
}

if (notificationJs.includes('window.KashKoolNotifications') &&
    notificationJs.includes('kashkoolDesktop.notify') &&
    coreJs.includes('KashKoolNotifications.timerFinished')) {
  pass('Timer, reminder engine, and desktop notification bridge are connected');
} else {
  fail('Timer or notification engine is not connected to the desktop bridge');
}

if (mainJs.includes('setBackgroundThrottling(false)') &&
    mainJs.includes('new Tray(') && mainJs.includes('Notification.isSupported()') &&
    mainJs.includes('LOCAL_PORT = 48762')) {
  pass('Desktop tray, background timers, stable local storage origin, and notifications are present');
} else {
  fail('Desktop background, stable local origin, or notification support is incomplete');
}

if (preloadJs.includes('contextBridge.exposeInMainWorld') &&
    mainJs.includes('contextIsolation: true')) {
  pass('Preload bridge is present');
} else {
  fail('Preload bridge is missing');
}

const jsFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath);
    else if (/\.(?:js|cjs|mjs)$/.test(entry.name)) jsFiles.push(absolutePath);
  }
}
walk(path.join(root, 'assets', 'js'));
walk(path.join(root, 'desktop'));
walk(path.join(root, 'scripts'));

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`JavaScript syntax error in ${path.relative(root, file)}: ${result.stderr || result.stdout}`);
  }
}
if (!failures.some((item) => item.startsWith('JavaScript syntax error'))) {
  pass(`JavaScript syntax checked (${jsFiles.length} files)`);
}

if (fs.existsSync(path.join(root, 'assets', 'icons', 'kashkool.ico')) &&
    fs.existsSync(path.join(root, 'assets', 'icons', 'kashkool.png'))) {
  pass('Application and tray icons are present');
} else {
  fail('One or more application icons are missing');
}

for (const label of checks) console.log(`OK   ${label}`);
for (const label of failures) console.error(`FAIL ${label}`);
console.log(`\n${checks.length} checks passed; ${failures.length} issue(s) found.`);
process.exitCode = failures.length ? 1 : 0;
