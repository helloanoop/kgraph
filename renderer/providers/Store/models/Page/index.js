import Block from '../Block';
import each from 'lodash/each';
import {immerable} from "immer";
import { isPageTitleADate, slugify } from 'utils/text';

const Page = function(values = {}) {
  this[immerable] = true;

  this.uid = values.uid || null;
  this.title = values.title || '';
  this.blocks = values.blocks || [new Block({index: 1})];
};

Page.prototype.setPage = function(page) {
  const now = new Date();
  this.filename = page.filename;
  this.pathname = page.pathname;
  this.uid = page.uid;
  this.title = page.title || '';
  this.blocks = this.setBlocksFromArray(page.blocks);
  this.icon = page.icon || null;
  this.is_daily = isPageTitleADate(page.title);
  this.is_outliner = page.is_outliner || false;
  this.slug = slugify(page.title);
  this.word_count = page.word_count || 0;
  this.created_at = page.created_at || now.toISOString();
  this.updated_at = page.updated_at || now.toISOString();

  this.hydrateParentAndIndexInfoInBlocks();
}

// blocks in args can contain children
// this function is used usually to init the blocks in the page
Page.prototype.setBlocksFromArray = function(arrBlocks = []) {
  const _setBlocksFromArray = (_arrBlocks = []) => {
    let createdBlocks = [];
    each(_arrBlocks, (b) => {
      let block = new Block({
        uid: b.uid,
        content: b.content,
        collapsed: b.collapsed
      });

      createdBlocks.push(block);

      if(b && b.blocks && b.blocks.length) {
        block.blocks = _setBlocksFromArray(b.blocks, block.blocks);
      }
    });

    return createdBlocks;
  };

  return _setBlocksFromArray(arrBlocks);
}

Page.prototype.hydrateParentAndIndexInfoInBlocks = function() {
  const hydrate = (blocks = [], parentBlock) => {
    each(blocks, (block, index) => {
      block.index = index;
      if(parentBlock) {
        block.parent = parentBlock.uid;
      }

      if(block.blocks && block.blocks.length) {
        return hydrate(block.blocks, block);
      }
    });
  };

  hydrate(this.blocks);
};

export default Page;
