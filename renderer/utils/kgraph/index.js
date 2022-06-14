import each from 'lodash/each';
import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
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