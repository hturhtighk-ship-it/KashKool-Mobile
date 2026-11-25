'use strict';

const { contextBridge, ipcRenderer } = require('electron');

function cleanText(value, fallback, limit) {
  return String(value == null ? fallback : value).slice(0, limit);
}

contextBridge.exposeInMainWorld('kashkoolDesktop', Object.freeze({
  isDesktop: true,

  notify(message) {
    const safeMessage = {
      title: cleanText(message && message.title, 'KashKool', 100),
      body: cleanText(message && message.body, '', 400),
      tag: cleanText(message && message.tag, 'kashkool-notice', 120)
    };
    return ipcRenderer.invoke('kashkool:notification', safeMessage);
  },

  notificationsSupported() {
    return ipcRenderer.invoke('kashkool:notifications-supported');
  },

  getStartupEnabled() {
    return ipcRenderer.invoke('kashkool:get-startup');
  },

  setStartupEnabled(enabled) {
    return ipcRenderer.invoke('kashkool:set-startup', Boolean(enabled));
  },

  showWindow() {
    ipcRenderer.send('kashkool:show');
  }
}));
