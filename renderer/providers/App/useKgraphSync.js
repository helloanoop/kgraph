import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  openKgraphEvent,
  addFileEvent,
  changeFileEvent,
  kgraphReadyEvent
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
        console.log(`hypergraph: changeFile`);
        console.log(val);
        dispatch(changeFileEvent({
          file: val
        }));
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

    const _kgraphRemoved = (pathname) => {
      // todo
    };

    const kgraphReady = () => {
      dispatch(kgraphReadyEvent());
    };

    ipcRenderer.invoke('renderer:ready');

    const removeListener1 = ipcRenderer.on('main:kgraph-opened', _kgraphOpened);
    const removeListener2 = ipcRenderer.on('main:kgraph-tree-updated', _kgraphUpdated);
    const removeListener3 = ipcRenderer.on('main:kgraph-removed', _kgraphRemoved);
    const removeListener4 = ipcRenderer.on('main:kgraph-ready', kgraphReady);

    return () => {
      removeListener1();
      removeListener2();
      removeListener3();
      removeListener4();
    };
  }, []);
};

export default useKgraphSync;