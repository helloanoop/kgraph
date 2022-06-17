const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { ipcMain } = require('electron');
const {
  isValidPathname,
  writeFile,
  browseDirectory,
  createDirectory
} = require('./utils/filesystem');
const { uuid } = require('./utils/common');

const yamlDumpOptions = {
  lineWidth: -1
};

const registerIpc = (mainWindow) => {
  // browse directory
  ipcMain.handle('renderer:browse-directory', async (event, pathname, request) => {
    try {
      const dirPath = await browseDirectory(mainWindow);

      return dirPath;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  // create hypergraph
  ipcMain.handle('renderer:create-hypergraph', async (event, hypergraphName, hypergraphLocation) => {
    try {
      const dirPath = path.join(hypergraphLocation, hypergraphName);
      if (fs.existsSync(dirPath)){
        throw new Error(`hypergraph: ${dir} already exists`);
      }

      if(!isValidPathname(dirPath)) {
        throw new Error(`hypergraph: invaid pathname - ${dir}`);
      }

      await createDirectory(dirPath);

      const content = yaml.dump({
        version: '1.0'
      });
      await writeFile(path.join(dirPath, 'hypergraph.yml'), content);

      const uid = uuid();
      mainWindow.webContents.send('main:hypergraph-opened', dirPath, uid);
      ipcMain.emit('main:hypergraph-opened', mainWindow, dirPath, uid);

      return;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  // new file
  ipcMain.handle('renderer:new-file', async (event, pathname, request) => {
    try {
      if (fs.existsSync(pathname)){
        throw new Error(`path: ${pathname} already exists`);
      }

      const content = yaml.dump(request, yamlDumpOptions);
      await writeFile(pathname, content);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  // save page
  ipcMain.handle('renderer:save-page', async (event, pathname, page) => {
    try {
      if (!fs.existsSync(pathname)){
        throw new Error(`path: ${pathname} does not exist`);
      }

      await writeFile(pathname, yaml.dump(page, yamlDumpOptions));
    } catch (error) {
      return Promise.reject(error);
    }
  });

  // rename item
  ipcMain.handle('renderer:rename-file', async (event, oldPath, newPath, newName) => {
    try {
      if (!fs.existsSync(oldPath)){
        throw new Error(`path: ${oldPath} does not exist`);
      }
      if (fs.existsSync(newPath)){
        throw new Error(`path: ${oldPath} already exists`);
      }

      return fs.renameSync(oldPath, newPath);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  // delete file
  ipcMain.handle('renderer:delete-file', async (event, pathname) => {
    try {
      if (!fs.existsSync(pathname)){
        throw new Error(`path: ${pathname} does not exist`);
      }

      await fs.unlinkSync(pathname);
    } catch (error) {
      return Promise.reject(error);
    }
  });
};

module.exports = registerIpc;
