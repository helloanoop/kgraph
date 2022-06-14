import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  openKgraphEvent,
  addFileEvent
} from 'providers/Store/slices/kgraph';

const useKgraphSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { ipcRenderer } = window;

    const _kgraphOpened = (pathname, uid) => {
      console.log(`kgraph uid: ${uid}, pathname: ${pathname}`);
      dispatch(openKgraphEvent({
        uid,
        pathname
      }));
    };

    const _kgraphUpdated = (type, val) => {
      if(type === 'addDir') {
        // todo
      }
      if(type === 'addFile') {
        console.log(`hypergraph: addFile`);
        dispatch(addFileEvent({
          file: val
        }));
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

    const removeListener1 = ipcRenderer.on('main:hypergraph-opened', _kgraphOpened);
    const removeListener2 = ipcRenderer.on('main:hypergraph-tree-updated', _kgraphUpdated);
    const removeListener3 = ipcRenderer.on('main:hypergraph-removed', _hypergraphRemoved);

    return () => {
      removeListener1();
      removeListener2();
      removeListener3();
    };
  }, []);
};

export default useKgraphSync;