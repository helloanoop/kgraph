import { nanoid } from 'nanoid'
import {immerable} from "immer";

const Block = function(values = {}) {
  this[immerable] = true;

  this.parent = values.parent || null;
  this.uid = values.uid || nanoid();
  this.content = values.content || '';
  this.index = values.index || null;
  this.fold = values.fold || false;
};

Block.prototype.hasParent = function(parent) {
  return this.parent ? true : false;
};

Block.prototype.hasChildren = function() {
  return this.blocks && this.blocks.length;
};

Block.prototype.isRootBlock = function() {
  return !this.parent;
};

export default Block;