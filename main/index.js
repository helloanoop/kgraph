const path = require('path');
const { format } = require('url');
const { BrowserWindow, app, ipcMain, Menu } = require('electron');
const { setContentSecurityPolicy } = require('electron-util');
const { isDirectory } = require('./utils/filesystem');
const { uuid } = require('./utils/common');
const { openHypergraph } = require('./app/hypergraph');

const LastOpenedHypergraphs = require('./app/last-opened-hypergraphs');
const Watcher = require('./app/watcher');

const menuTemplate = require('./app/menu-template');
const registerIpc = require('./ipc');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');

const lastOpenedHypergraphs = new LastOpenedHypergraphs();

setContentSecurityPolicy(`
	default-src * 'unsafe-inline' 'unsafe-eval';
	script-src * 'unsafe-inline' 'unsafe-eval';
	connect-src * 'unsafe-inline';
	base-uri 'none';
	form-action 'none';
	frame-ancestors 'none';
`);

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

let mainWindow;
let watcher;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: path.join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true
      });

  watcher = new Watcher();

  mainWindow.loadURL(url);

  // register all ipc handlers
  registerIpc(mainWindow);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

ipcMain.handle('renderer:ready', async (event) => {
  // reload last opened collections
  const lastOpened = lastOpenedHypergraphs.getAll();
  if(lastOpened && lastOpened.length) {
    for(let hypergraphPath of lastOpened) {
      if(isDirectory(hypergraphPath)) {
        const uid = uuid();
        mainWindow.webContents.send('main:hypergraph-opened', hypergraphPath, uid);
        ipcMain.emit('main:hypergraph-opened', mainWindow, hypergraphPath, uid);
      }
    }
  }
});

ipcMain.on('main:hypergraph-opened', (win, pathname, uid) => {
  watcher.addWatcher(win, pathname, uid);
  lastOpenedCollections.add(pathname);
});

ipcMain.on('main:open-hypergraph', () => {
  if(watcher && mainWindow) {
    openHypergraph(mainWindow, watcher);
  }
});

ipcMain.handle('renderer:open-hypergraph', () => {
  if(watcher && mainWindow) {
    openHypergraph(mainWindow, watcher);
  }
});

ipcMain.handle('renderer:remove-hypergraph', async (event, hypergraphPath) => {
  if(watcher && mainWindow) {
    watcher.removeWatcher(hypergraphPath, mainWindow);
    lastOpenedCollections.remove(hypergraphPath);
  }
});
