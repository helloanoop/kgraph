const _ = require('lodash');
const Store = require('electron-store');
const { isDirectory } = require('../utils/filesystem');

class LastOpenedNotebases {
  constructor() {
    this.store = new Store({
      name: 'preferences',
      clearInvalidConfig: true
    });
  }

  getAll() {
    return this.store.get('lastOpenedNotebases') || [];
  }

  add(notebasePath) {
    const notebases = this.store.get('lastOpenedNotebases') || [];

    if(isDirectory(notebasePath)) {
      if(!notebases.includes(notebasePath)) {
        notebases.push(notebasePath);
        this.store.set('lastOpenedNotebases', notebases);
      }
    }
  }

  remove(notebasePath) {
    let notebases = this.store.get('lastOpenedNotebases') || [];

    if(notebases.includes(notebasePath)) {
      notebases = _.filter(notebases, c => c !== notebasePath);
      this.store.set('lastOpenedNotebases', notebases);
    }
  }

  removeAll() {
    return this.store.set('lastOpenedNotebases', []);
  }
};

module.exports = LastOpenedNotebases;
