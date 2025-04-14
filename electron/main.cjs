/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
// Change main.js to CommonJS
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { installScreenpipeCli, startScreenpipeService, analyzeData } = require('./screenpipeHandler.cjs');

// Debug logging
console.log('Main process starting...');
console.log('__dirname:', __dirname);

let mainWindow;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Preload path:', preloadPath);
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      // Add this for debugging
      devTools: true
    }
  });

  // Open DevTools automatically
  mainWindow.webContents.openDevTools();

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);
  
  // Listen for when the window is ready
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded successfully');
  });
}
