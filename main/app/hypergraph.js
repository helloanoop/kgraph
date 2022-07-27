const { uuid } = require('../utils/common');
const { dialog, ipcMain } = require('electron');
const { isDirectory, normalizeAndResolvePath } = require('../utils/filesystem');

const openHypergraph = async (win, watcher) => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory']
  });

  if (filePaths && filePaths[0]) {
    const resolvedPath = normalizeAndResolvePath(filePaths[0]);
    if (isDirectory(resolvedPath)) {
      if(!watcher.hasWatcher(resolvedPath)) {
        const uid = uuid();
        win.webContents.send('main:kgraph-opened', resolvedPath, uid);
        ipcMain.emit('main:kgraph-opened', win, resolvedPath, uid);
      }
    } else {
      console.error(`[ERROR] Cannot open unknown folder: "${resolvedPath}"`);
    }
  }
};

module.exports = {
  openHypergraph
};
