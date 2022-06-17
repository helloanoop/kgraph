import each from 'lodash/each';
import find from 'lodash/find';
import last from 'lodash/last';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import values from 'lodash/values';
import isString from 'lodash/isString';

export const findPageInKgraphByPathname = (pages, pathname) => {
  return find(pages, (p) => p.pathname === pathname);
};

export const flattenBlocks = (blocks = []) => {
  const flattenedBlocks = [];

  const flatten = (blks, flattened) => {
    each(blks, (b) => {
      flattened.push(b);

      if(b.blocks && b.blocks.length) {
        flatten(b.blocks, flattened);
      }
    })
  }

  flatten(blocks, flattenedBlocks);

  return flattenedBlocks;
};

export const getUidBlockMap = (blocks = []) => {
  let map = {};
  each(blocks, (b) => {
    map[b.uid] = b;
  });

  return map;
};

export const getWordCountInPage = (page) => {
  let blocks = flattenBlocks(page.blocks);

  return reduce(blocks, (count, block) => {
    let text = block.content;
    if(!text || isString(text) || !text.length ) {
      return count;
    }
    let cleanedText = text
      .replace(/\[ \]/g, '')
      .replace(/\[x\]/g, '')
      .replace(/\[X\]/g, '')
      .split(' ');

    let filteredText = filter(cleanedText, (text) => {
      return text != '';
    });

    let textLength = filteredText.length;
    return textLength + count;
  }, 0);
};

export const insertAtIndex = (blocks, block, position) => {
  blocks.splice(position, 0, block);
}

export const getLastChildLeaf = (block) => {
  if(!block.blocks || !block.blocks.length) {
    return null;
  }

  let lastChild = last(block.blocks);

  if(lastChild.hasChildren()) {
    return getLastChildLeaf(lastChild);
  }

  return lastChild;
}

export const getNextSibling = (block, uidBlockMap) => {
  const parentBlock = uidBlockMap[block.parent];

  if(parentBlock) {
    const blockIndex = parentBlock.blocks.indexOf(block);
    if (blockIndex === parentBlock.blocks.length - 1) {
      return null;
    }

    const nextSiblingBlock = parentBlock.blocks[blockIndex + 1];
    return nextSiblingBlock;
  } else {
    return null;
  }
}

export const getPrevSibling = (block, uidBlockMap) => {
  const parentBlock = uidBlockMap[block.parent];

  if(parentBlock) {
    const blockIndex = parentBlock.blocks.indexOf(block);
    if (blockIndex < 1) {
      return null;
    }

    const prevSiblingBlock = parentBlock.blocks[blockIndex - 1];
    return prevSiblingBlock;
  } else {
    return null;
  }
}

export const getNextBlockUp = (block, uidBlockMap) => {
  const prevSibling = getPrevSibling(block, uidBlockMap);
  if (prevSibling) {
    if (prevSibling.hasChildren()) {
      return getLastChildLeaf(prevSibling)
    } else {
      return prevSibling
    }
  } else {
    const parent = uidBlockMap[block.parent];

    if(parent) {
      return parent;
    }

    // root block scenario
    if(!parent) {
      const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
      const blockIndex = rootBlocks.indexOf(block);
      if (blockIndex === 0) { // already at the begining
        return null;
      }

      const prevSibling = rootBlocks[blockIndex - 1];

      if (prevSibling.hasChildren()) {
        return getLastChildLeaf(prevSibling)
      } else {
        return prevSibling
      }
    }
  }
}

export const getNextBlockDown = (block, uidBlockMap, checkChildren=true) => {
  if (checkChildren && block.hasChildren()) {
    return block.blocks[0];
  }

  const nextSibling = getNextSibling(block, uidBlockMap);
  if (nextSibling) {
    return nextSibling
  }

  const parentBlock = uidBlockMap[block.parent];

  // root block scenario
  if(!parentBlock){
    const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
    const blockIndex = rootBlocks.indexOf(block);
    if (blockIndex === rootBlocks.length - 1) { // end of blocks
      return null;
    }

    const nextSiblingBlock = rootBlocks[blockIndex + 1];
    return nextSiblingBlock;
  }

  return getNextBlockDown(parentBlock, uidBlockMap, false)
}

export const indentBlockRight = (block, uidBlockMap, page) => {
  const parentBlock = uidBlockMap[block.parent];

  if(parentBlock) {
    const blockIndex = parentBlock.blocks.indexOf(block);
    if (blockIndex > 0) {
      const prevSibling = parentBlock.blocks[blockIndex - 1];
      parentBlock.blocks.splice(blockIndex, 1)
      prevSibling.blocks = prevSibling.blocks || [];
      prevSibling.blocks.push(block);
      block.parent = prevSibling.uid;
    }
  }

  // root block scenario
  if(!parentBlock){
    const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
    const blockIndex = rootBlocks.indexOf(block);
    if (blockIndex > 0) {
      const prevSibling = rootBlocks[blockIndex - 1];
      page.blocks.splice(blockIndex, 1);
      prevSibling.blocks = prevSibling.blocks || [];
      prevSibling.blocks.push(block);
      block.parent = prevSibling.uid;
    }
  }
};

export const indentBlockLeft = (block, uidBlockMap, page) => {
  const parentBlock = uidBlockMap[block.parent];

  if(parentBlock && parentBlock.parent) {
    const grandParentBlock = uidBlockMap[parentBlock.parent];
    const blockIndex = parentBlock.blocks.indexOf(block);
    const parentBlockIndex = grandParentBlock.blocks.indexOf(parentBlock);
    if (parentBlockIndex >= 0) {
      parentBlock.blocks.splice(blockIndex, 1);
      grandParentBlock.blocks.splice(parentBlockIndex + 1, 0, block);
      block.parent = grandParentBlock.uid;
    }
  }

  // grandparent is root
  if(parentBlock && !parentBlock.parent) {
    const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
    const blockIndex = parentBlock.blocks.indexOf(block);
    const parentBlockIndex = rootBlocks.indexOf(parentBlock);
    if (parentBlockIndex >= 0) {
      parentBlock.blocks.splice(blockIndex, 1);
      page.blocks.splice(parentBlockIndex + 1, 0, block);
      block.parent = null;
    }
  }
};

export const addBlockToPage = (newBlock, currentBlock, uidBlockMap, page, caretPosition) => {
  if(currentBlock.hasChildren()) {
    newBlock.parent = currentBlock.uid;
    insertAtIndex(currentBlock.blocks, newBlock, 0);
    return;
  }

  const parentBlock = uidBlockMap[currentBlock.parent];

  if(parentBlock) {
    const currentBlockIndex = parentBlock.blocks.indexOf(currentBlock);
    const insertPosition = caretPosition > 0 ? currentBlockIndex + 1 : currentBlockIndex;
    newBlock.parent = parentBlock.uid;
    insertAtIndex(parentBlock.blocks, newBlock, insertPosition);
  }

  // root block scenario
  if(!parentBlock){
    const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
    const currentBlockIndex = rootBlocks.indexOf(currentBlock);
    const insertPosition = caretPosition > 0 ? currentBlockIndex + 1 : currentBlockIndex;
    newBlock.parent = null;
    insertAtIndex(page.blocks, newBlock, insertPosition);
  }
};

export const removeBlockFromPage = (block, uidBlockMap, page) => {
  const parentBlock = uidBlockMap[block.parent];

  if(parentBlock) {
    const blockIndex = parentBlock.blocks.indexOf(block);
    parentBlock.blocks.splice(blockIndex, 1);
  } else {
    const rootBlocks = filter(values(uidBlockMap), (b) => !b.parent);
    const blockIndex = rootBlocks.indexOf(block);
    page.blocks.splice(blockIndex, 1);
  }
};

export const extractPageRefs = (block) => {
  const regex = /\[\[([^[\]]*)\]\]/g;
  let content = block.content || '';
  let results = content.match(regex);

  return map(results, (r) => r.substring(2, r.length - 2));
};

export const transformPageToSaveToFilesystem = (page) => {
  const getBlocks = (blocks = []) => {
    let pageBlocks = [];
    
    each(blocks, (block) => {
      let b = {};
      b.uid = block.uid;
      b.content = block.content || '';
      b.collapsed = block.collapsed || false;
  
      if(block.blocks && block.blocks.length) {
        b.blocks = getBlocks(block.blocks);
      }
  
      pageBlocks.push(b);
    });
  
    return pageBlocks;
  };

  return {
    uid: page.uid,
    title: page.title,
    icon: page.icon,
    cover: page.cover,
    is_outliner: page.is_outliner,
    blocks: getBlocks(page.blocks),
    created_at: page.created_at,
    updated_at: page.created_at
  }
};