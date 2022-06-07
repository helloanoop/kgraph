const _ = require('lodash');
const Store = require('electron-store');
const { isDirectory } = require('../utils/filesystem');

class LastOpenedHypergraphs {
  constructor() {
    this.store = new Store({
      name: 'preferences',
      clearInvalidConfig: true
    });
  }

  getAll() {
    return this.store.get('lastOpenedHypergraphs') || [];
  }

  add(hypergraphPath) {
    const hypergraphs = this.store.get('lastOpenedHypergraphs') || [];

    if(isDirectory(hypergraphPath)) {
      if(!hypergraphs.includes(hypergraphPath)) {
        hypergraphs.push(hypergraphPath);
        this.store.set('lastOpenedHypergraphs', hypergraphs);
      }
    }
  }

  remove(hypergraphPath) {
    let hypergraphs = this.store.get('lastOpenedHypergraphs') || [];

    if(hypergraphs.includes(hypergraphPath)) {
      hypergraphs = _.filter(hypergraphs, c => c !== hypergraphPath);
      this.store.set('lastOpenedHypergraphs', hypergraphs);
    }
  }

  removeAll() {
    return this.store.set('lastOpenedHypergraphs', []);
  }
};

module.exports = LastOpenedHypergraphs;
