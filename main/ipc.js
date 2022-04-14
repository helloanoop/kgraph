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

  // create notebase
  ipcMain.handle('renderer:create-notebase', async (event, notebaseName, notebaseLocation) => {
    try {
      const dirPath = path.join(notebaseLocation, notebaseName);
      if (fs.existsSync(dirPath)){
        throw new Error(`notebase: ${dir} already exists`);
      }

      if(!isValidPathname(dirPath)) {
        throw new Error(`notebase: invaid pathname - ${dir}`);
      }

      await createDirectory(dirPath);

      const content = yaml.dump({
        version: '1.0'
      });
      await writeFile(path.join(dirPath, 'notebase.yml'), content);

      const uid = uuid();
      mainWindow.webContents.send('main:notebase-opened', dirPath, uid);
      ipcMain.emit('main:notebase-opened', mainWindow, dirPath, uid);

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

  // save file
  ipcMain.handle('renderer:save-file', async (event, pathname, fileContents) => {
    try {
      if (!fs.existsSync(pathname)){
        throw new Error(`path: ${pathname} does not exist`);
      }

      await writeFile(pathname, yaml.dump(fileContents, yamlDumpOptions));
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
