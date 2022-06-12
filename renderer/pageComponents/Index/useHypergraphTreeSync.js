import { useEffect } from 'react';

const useHypergraphTreeSync = () => {
  useEffect(() => {
    const { ipcRenderer } = window;

    const _openHypergraph = (pathname, uid) => {
      console.log(`hypergraph uid: ${uid}, pathname: ${pathname}`);
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

    const _hypergraphRemoved = (pathname) => {
      // todo
    };

    ipcRenderer.invoke('renderer:ready');

    const removeListener1 = ipcRenderer.on('main:hypergraph-opened', _openHypergraph);
    const removeListener2 = ipcRenderer.on('main:hypergraph-tree-updated', _collectionTreeUpdated);
    const removeListener3 = ipcRenderer.on('main:hypergraph-removed', _hypergraphRemoved);

    return () => {
      removeListener1();
      removeListener2();
      removeListener3();
    };
  }, []);
};

export default useHypergraphTreeSync;