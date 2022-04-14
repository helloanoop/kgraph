import { useEffect } from 'react';

const useNotebaseTreeSync = () => {
  useEffect(() => {
    const { ipcRenderer } = window;

    const _openNotebase = (pathname, uid) => {
      console.log(`notebase uid: ${uid}, pathname: ${pathname}`);
      // todo
    };

    const _collectionTreeUpdated = (type, val) => {
      if(type === 'addDir') {
        // todo
      }
      if(type === 'addFile') {
        // todo
      }
      if(type === 'change') {
        // todo
      }
      if(type === 'unlink') {
        setTimeout(() => {
          // todo
        }, 100);
      }
      if(type === 'unlinkDir') {
        // todo
      }
    };

    const _notebaseRemoved = (pathname) => {
      // todo
    };

    ipcRenderer.invoke('renderer:ready');

    const removeListener1 = ipcRenderer.on('main:notebase-opened', _openNotebase);
    const removeListener2 = ipcRenderer.on('main:notebase-tree-updated', _collectionTreeUpdated);
    const removeListener3 = ipcRenderer.on('main:notebase-removed', _notebaseRemoved);

    return () => {
      removeListener1();
      removeListener2();
      removeListener3();
    };
  }, []);
};

export default useNotebaseTreeSync;