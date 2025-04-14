/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron');

// Debug logging
console.log('Preload script executing...');

// Expose the API using contextBridge
contextBridge.exposeInMainWorld('electron', {
  screenpipe: {
    installCli: () => {
      console.log('Install CLI function called');
      return ipcRenderer.invoke('screenpipe:install');
    },
    startService: () => {
      console.log('Start service function called');
      return ipcRenderer.invoke('screenpipe:start');
    },
    analyzeData: () => {
      console.log('Analyze data function called');
      return ipcRenderer.invoke('screenpipe:analyze');
    }
  }
});

console.log('API exposed to renderer:', !!contextBridge);
