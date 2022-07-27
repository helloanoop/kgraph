const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chokidar = require('chokidar');
const { hasYamlExtension } = require('../utils/filesystem');

const add = async (win, pathname, uid) => {
  const isYaml = hasYamlExtension(pathname);
  console.log(`watcher add: ${pathname}`);

  if(isYaml) {
    const file = {
      uid,
      pathname,
      name: path.basename(pathname),
    }

    try {
      const yamlData = fs.readFileSync(pathname, 'utf8');
      file.data = yaml.load(yamlData);
      win.webContents.send('main:kgraph-tree-updated', 'addFile', file);
    } catch (err) {
      console.error(err)
    }
  }
};

const addDirectory = (win, pathname, uid) => {
  console.log(`watcher addDirectory: ${pathname}`);
  const directory = {
    uid,
    pathname,
    name: path.basename(pathname)
  };
  win.webContents.send('main:kgraph-tree-updated', 'addDir', directory);
};

const change = (win, pathname, uid) => {
  console.log(`watcher change: ${pathname}`);
  const file = {
    uid,
    pathname,
    name: path.basename(pathname)
  };

  try {
    const yamlData = fs.readFileSync(pathname, 'utf8');
    file.data = yaml.load(yamlData);
    win.webContents.send('main:kgraph-tree-updated', 'change', file);
  } catch (err) {
    console.error(err)
  }
};

const unlink = (win, pathname, uid) => {
  console.log(`watcher unlink: ${pathname}`);
  const file = {
    uid,
    pathname,
    name: path.basename(pathname)
  };
  win.webContents.send('main:kgraph-tree-updated', 'unlink', file);
}

const unlinkDir = (win, pathname, uid) => {
  console.log(`watcher unlinkDir: ${pathname}`);
  const directory = {
    uid,
    pathname,
    name: path.basename(pathname)
  };
  win.webContents.send('main:kgraph-tree-updated', 'unlinkDir', directory);
}

const ready = (win) => {
  console.log(`watcher ready`);
  win.webContents.send('main:kgraph-ready');
}

class Watcher {
  constructor () {
    this.watchers = {};
  }

  addWatcher (win, watchPath, uid) {
    if(this.watchers[watchPath]) {
      this.watchers[watchPath].close();
    }

    const self = this;
    setTimeout(() => {
      const watcher = chokidar.watch(watchPath, {
        ignoreInitial: false,
        usePolling: false,
        ignored: path => ["node_modules", ".git", "hypergraph.yml"].some(s => path.includes(s)),
        persistent: true,
        ignorePermissionErrors: true,
        awaitWriteFinish: {
          stabilityThreshold: 80,
          pollInterval: 10
        },
        depth: 2
      });
  
      watcher
        .on('add', pathname => add(win, pathname, uid))
        .on('addDir', pathname => addDirectory(win, pathname, uid))
        .on('change', pathname => change(win, pathname, uid))
        .on('unlink', pathname => unlink(win, pathname, uid))
        .on('unlinkDir', pathname => unlinkDir(win, pathname, uid))
        .on('ready', () => ready(win))
  
        self.watchers[watchPath] = watcher;
    }, 100);
  }

  hasWatcher (watchPath) {
    return this.watchers[watchPath];
  }

  removeWatcher (watchPath, win) {
    if(this.watchers[watchPath]) {
      this.watchers[watchPath].close();
      this.watchers[watchPath] = null;
      win.webContents.send('main:kgraph-removed', watchPath);
    }
  }
};

module.exports =  Watcher;
