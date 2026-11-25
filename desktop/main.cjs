'use strict';

const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  Notification,
  ipcMain,
  nativeImage,
  shell,
  dialog
} = require('electron');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const APP_ROOT = path.resolve(__dirname, '..');
const ICON_PNG = path.join(APP_ROOT, 'assets', 'icons', 'kashkool.png');
const ICON_ICO = path.join(APP_ROOT, 'assets', 'icons', 'kashkool.ico');

// Keep this origin stable: Chromium stores localStorage, Firebase auth state,
// and the service-worker cache by origin (including the port).
const LOCAL_HOST = 'localhost';
const LOCAL_PORT = 48762;
const APP_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}/`;
const APP_ORIGIN = new URL(APP_URL).origin;

let mainWindow = null;
let tray = null;
let localServer = null;
let isQuitting = false;

app.setAppUserModelId('com.kashkool.study');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4'
};

function isInsideAppRoot(filePath) {
  const relative = path.relative(APP_ROOT, filePath);
  return relative === '' || (
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function safeFilePath(requestUrl) {
  let parsed;
  let pathname;

  try {
    parsed = new URL(requestUrl, APP_URL);
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    return null;
  }

  if (parsed.origin !== APP_ORIGIN) return null;
  if (!pathname || pathname === '/') pathname = '/index.html';

  const candidate = path.resolve(APP_ROOT, `.${pathname}`);
  return isInsideAppRoot(candidate) ? candidate : null;
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    localServer = http.createServer((request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Method not allowed');
        return;
      }

      const requestedPath = safeFilePath(request.url || '/');
      if (!requestedPath) {
        response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Forbidden');
        return;
      }

      // Resolve symlinks too, so a file placed outside the app folder cannot
      // be exposed by a link inside the package.
      fs.realpath(requestedPath, (realPathError, realPath) => {
        if (realPathError || !isInsideAppRoot(realPath)) {
          response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          response.end('Not found');
          return;
        }

        fs.stat(realPath, (statError, stats) => {
          if (statError || !stats.isFile()) {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Not found');
            return;
          }

          const contentType = mimeTypes[path.extname(realPath).toLowerCase()] || 'application/octet-stream';
          response.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
          });

          if (request.method === 'HEAD') {
            response.end();
            return;
          }

          const stream = fs.createReadStream(realPath);
          stream.on('error', () => {
            if (!response.headersSent) response.writeHead(500);
            response.end();
          });
          stream.pipe(response);
        });
      });
    });

    localServer.once('error', reject);
    localServer.listen(LOCAL_PORT, LOCAL_HOST, () => {
      localServer.removeListener('error', reject);
      resolve();
    });
  });
}

function isTrustedSender(event) {
  try {
    const senderUrl = event.senderFrame?.url || event.sender.getURL();
    return new URL(senderUrl).origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

function openExternal(url) {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
  shell.openExternal(url).catch(() => {});
}

function showWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) createWindow();
  if (!mainWindow || mainWindow.isDestroyed()) return;

  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) return;

  mainWindow = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 900,
    minHeight: 620,
    show: false,
    backgroundColor: '#101720',
    autoHideMenuBar: true,
    icon: process.platform === 'win32' ? ICON_ICO : ICON_PNG,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Keep timers and reminder checks alive while the app is hidden in the tray.
  mainWindow.webContents.setBackgroundThrottling(false);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    let destination;
    try {
      destination = new URL(url);
    } catch {
      event.preventDefault();
      return;
    }

    if (destination.origin === APP_ORIGIN) return;
    event.preventDefault();
    openExternal(url);
  });

  mainWindow.once('ready-to-show', () => {
    if (!process.argv.includes('--hidden')) mainWindow.show();
  });

  mainWindow.on('minimize', (event) => {
    if (isQuitting) return;
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (event) => {
    if (isQuitting) return;
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(APP_URL).catch((error) => {
    dialog.showErrorBox('KashKool could not open', String(error?.message || error));
  });
}

function setStartupEnabled(enabled) {
  if (!app.isPackaged) return false;

  const value = Boolean(enabled);
  try {
    app.setLoginItemSettings({
      openAtLogin: value,
      path: process.execPath,
      args: value ? ['--hidden'] : []
    });
    refreshTrayMenu();
    return Boolean(app.getLoginItemSettings().openAtLogin);
  } catch {
    return false;
  }
}

function refreshTrayMenu() {
  if (!tray) return;

  const startup = Boolean(app.getLoginItemSettings().openAtLogin);
  const menu = Menu.buildFromTemplate([
    { label: 'Open KashKool', click: showWindow },
    { type: 'separator' },
    {
      label: 'Run when Windows starts',
      type: 'checkbox',
      checked: startup,
      enabled: app.isPackaged,
      click: (item) => {
        setStartupEnabled(item.checked);
      }
    },
    { type: 'separator' },
    {
      label: 'Quit KashKool',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
}

function createTray() {
  if (tray) return;

  let trayImage = nativeImage.createFromPath(
    process.platform === 'win32' ? ICON_ICO : ICON_PNG
  );
  if (trayImage.isEmpty()) trayImage = nativeImage.createFromPath(ICON_PNG);
  if (trayImage.isEmpty()) trayImage = nativeImage.createEmpty();

  tray = new Tray(trayImage);
  tray.setToolTip('KashKool — Study Planner');
  tray.on('click', showWindow);
  tray.on('double-click', showWindow);
  refreshTrayMenu();
}

ipcMain.handle('kashkool:notifications-supported', (event) => {
  return isTrustedSender(event) && Notification.isSupported();
});

ipcMain.handle('kashkool:notification', (event, message = {}) => {
  if (!isTrustedSender(event) || !Notification.isSupported()) return false;

  const title = String(message.title || 'KashKool').slice(0, 100);
  const body = String(message.body || '').slice(0, 400);
  const notice = new Notification({
    title,
    body,
    icon: ICON_PNG,
    silent: false
  });

  notice.on('click', showWindow);
  notice.show();
  return true;
});

ipcMain.handle('kashkool:get-startup', (event) => {
  if (!isTrustedSender(event)) return false;
  return Boolean(app.getLoginItemSettings().openAtLogin);
});

ipcMain.handle('kashkool:set-startup', (event, enabled) => {
  if (!isTrustedSender(event)) return false;
  return setStartupEnabled(enabled);
});

ipcMain.on('kashkool:show', (event) => {
  if (isTrustedSender(event)) showWindow();
});

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) {
  app.quit();
} else {
  app.on('second-instance', showWindow);

  app.whenReady().then(async () => {
    try {
      await startLocalServer();
    } catch (error) {
      const details = error && error.code === 'EADDRINUSE'
        ? `Port ${LOCAL_PORT} is already in use. Close the other app using it and try again.`
        : String((error && error.message) || error);
      dialog.showErrorBox('KashKool could not start', details);
      app.quit();
      return;
    }

    createTray();
    createWindow();
  });
}

app.on('activate', showWindow);
app.on('before-quit', () => {
  isQuitting = true;
  if (localServer) {
    localServer.close();
    localServer = null;
  }
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

// A hidden main window is intentional: the process remains available from the tray.
app.on('window-all-closed', () => {});
