import { transformPageToSaveToFilesystem } from 'utils/kgraph';

export const createPage = (page, pathname) => {
  const { ipcRenderer } = window;
  const p = transformPageToSaveToFilesystem(page);
  ipcRenderer
    .invoke('renderer:create-page', pathname, p)
    .catch((error) => console.log(error));
};


const savePage = (page) => {
  const { ipcRenderer } = window;
  const p = transformPageToSaveToFilesystem(page);
  ipcRenderer
    .invoke('renderer:save-page', page.pathname, p)
    .catch((error) => console.log(error));
};