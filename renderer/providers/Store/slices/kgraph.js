import path from 'path';
import { createSlice } from '@reduxjs/toolkit';
import { slugify } from 'utils/text';
import {
  dsid,
  loadPageIntoDatascript,
  checkPagerefsAndAddPageIfNotFound
} from 'utils/datascript';
import {
  flattenBlocks,
  getUidBlockMap,
  indentBlockLeft,
  indentBlockRight,
  getNextBlockUp,
  getNextBlockDown,
  addBlockToPage,
  removeBlockFromPage
} from 'utils/kgraph';
import { uuid } from 'utils/common';
import { createPage, savePage } from 'utils/ipc';
import { createConnection } from 'utils/datascript';
import Page from '../models/Page';
import Block from '../models/Block';

const initialState = {
  dsConnection: null,
  kgraph: {},

  // this var is used to store the newly added page id
  // when the page shows up in the addFileEvent, we can
  // copy the value to routeToNewlyAddedPage
  newlyAddedPageUid: null,

  // The AppProvider listens to changes to this var
  // and routes it to the new page
  // I know, this is not an elegant solution :)
  // Let me know if there is a better way of doing this
  routeToNewlyAddedPageUid: null
};

export const kgraphSlice = createSlice({
  name: 'kgraph',
  initialState,
  reducers: {
    openKgraphEvent: (state, action) => {
      state.kgraph = {
        uid: action.payload.uid,
        name: path.basename(action.payload.pathname),
        pathname: action.payload.pathname,
        pageMap: new Map(),
        pageSlugMap: new Map(),
        focusedBlock: {}
      };
      state.dsConnection = createConnection();
    },
    addFileEvent: (state, action) => {
      const file = action.payload.file;

      if(state.kgraph) {
        let page = new Page()
        page.setPage({
          filename: file.name,
          pathname: file.pathname,
          uid: file.data.uid,
          title: file.data.title,
          blocks: file.data.blocks,
          icon: file.data.icon,
          cover: file.data.cover,
          is_outliner: file.data.is_outliner
        });
        page.dsid = dsid();
        state.kgraph.pageMap.set(page.uid, page);
        state.kgraph.pageSlugMap.set(page.slug, page.uid);
        loadPageIntoDatascript(state.dsConnection, state.kgraph, page);

        if(state.newlyAddedPageUid === page.uid) {
          state.routeToNewlyAddedPageUid = state.newlyAddedPageUid;
        }
      }
    },
    changeFileEvent: (state, action) => {
      const file = action.payload.file;
      const kgraph = state.kgraph;
      if(!file || !kgraph || !kgraph.pageMap || !kgraph.pageSlugMap) {
        return;
      }
      console.log(action.payload);
      const page = kgraph.pageMap.get(file.data.uid);
      if(page) {
        page.setPage({
          filename: file.name,
          pathname: file.pathname,
          uid: file.data.uid,
          title: file.data.title,
          blocks: file.data.blocks,
          icon: file.data.icon,
          cover: file.data.cover,
          is_outliner: file.data.is_outliner
        })
      }
    },
    pageTitleChanged: (state, action) => {
      const kgraph = state.kgraph;
      if(!kgraph || !kgraph.pageMap || !kgraph.pageSlugMap) {
        return;
      }

      const page = kgraph.pageMap.get(action.payload.pageUid);
      if(!page || page.slug === slugify(action.payload.title)) {
        return;
      }
      const oldTitle = page.title;
      const newTitle = action.payload.title;
      page.title = newTitle;
      page.slug = slugify(newTitle);

      savePage(page);

      // if(action.movetoFirstBlock) {
      //   draft.focusedBlock.uid = page.blocks[0].uid;
      // }
      // if(action.triggerSaveTransaction) {
      //   draft.triggerSaveTransaction = nanoid();
      // }

      // update pageSlugMap
      kgraph.pageSlugMap.delete(slugify(oldTitle));
      kgraph.pageSlugMap.set(slugify(newTitle), page.uid);

      // // cascade changes across pagerefs
      // const dsQuery = `
      //   [:find ?pid ?puid ?pTitle
      //     :where [?pid ":page/refs" ?refPageId]
      //           [?pid ":page/title" ?pTitle]
      //           [?pid ":page/uid" ?puid]
      //           [?refPageId ":page/title" "${oldTitle}"]]
      // `;
      // const results = datascript.q(dsQuery, datascript.db(draft.datascriptConnection));
      // each(results, (result) => {
      //   const pid = result[0];
      //   const puid = result[1];

      //   let page = draft.pageMap.get(puid);
      //   let regex = new RegExp(`\\[\\[${oldTitle}\\]\\]`, 'ig');
      //   if(page) {
      //     const flattenedBlocks = flattenBlocks(page.blocks);
      //     each(flattenedBlocks, (block) => {
      //       if(block && block.content) {
      //         block.content = block.content.replace(regex, `[[${newTitle}]]`);
      //       }
      //     });
      //     addToModifiedNotes(draft, page.uid);
      //   };
      // });

      // // update title in datascript
      // const dsQuery2 = `
      //   [:find ?pid
      //     :where [?pid ":page/title" "${oldTitle}"]]
      // `;
      // const result = datascript.q(dsQuery2, datascript.db(draft.datascriptConnection));
      // if(result && result.length && result[0]) {
      //   let pid =result[0][0]
      //   datascript.transact(draft.datascriptConnection, [{
      //     ':db/id': pid,
      //     ':page/title': newTitle
      //   }]);
      // }
    },
    focusBlock: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      const hasUncheckedBox = /^\[ \]/.test(currentBlock.content);
      const hasCheckedBox = /^\[X\]/.test(currentBlock.content) || /^\[x\]/.test(currentBlock.content);
      kgraph.focusedBlock.uid = currentBlock.uid;
      kgraph.focusedBlock.caretPos = action.payload.caretPosition;

      if(hasCheckedBox || hasUncheckedBox) {
        kgraph.focusedBlock.caretPos += 3;
      }
    },
    collapseBlock: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      currentBlock.collapsed = !currentBlock.collapsed;
      savePage(page);
    },
    togglePageOutliner: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      page.is_outliner = !page.is_outliner;
      savePage(page);
    },
    onBlockBlur: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      if(currentBlock.content !== action.payload.content) {
        currentBlock.content = action.payload.content;
        savePage(page);
      }
      kgraph.focusedBlock.uid = null;
      kgraph.focusedBlock.caretPos = 0;
      checkPagerefsAndAddPageIfNotFound(state.dsConnection, currentBlock, page, state.kgraph);
    },
    blockEnterKeyPressed: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      const newBlock = new Block();
      currentBlock.content = action.payload.event.target.value;

      // enter within text
      if (action.payload.caretPosition !== 0 && action.payload.event.target.selectionStart !== action.payload.event.target.value.length) {
        const start = action.payload.event.target.selectionStart;
        newBlock.content = currentBlock.content.substring(start);
        currentBlock.content = currentBlock.content.substring(0, start);
      }

      addBlockToPage(newBlock, currentBlock, uidBlockMap, page, action.payload.caretPosition);
      savePage(page);
      kgraph.focusedBlock.uid = newBlock.uid;
    },
    blockTabKeyPressed: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      if(action.payload.event.shiftKey) {
        indentBlockLeft(currentBlock, uidBlockMap, page);
      } else {
        indentBlockRight(currentBlock, uidBlockMap, page);
      }
      kgraph.focusedBlock.uid = currentBlock.uid;
      kgraph.focusedBlock.caretPos = action.payload.caretPosition;
      currentBlock.content = action.payload.event.target.value;
      savePage(page);
    },
    blockUpKeyPressed: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      const nextBlockUp = getNextBlockUp(currentBlock, uidBlockMap);
      if(nextBlockUp) {
        kgraph.focusedBlock.uid = nextBlockUp.uid;
      }
      if(currentBlock.content !== action.payload.event.target.value) {
        currentBlock.content = action.payload.event.target.value;
        savePage(page);
      }
    },
    blockDownKeyPressed: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      const nextBlockDown = getNextBlockDown(currentBlock, uidBlockMap);
      if(nextBlockDown) {
        kgraph.focusedBlock.uid = nextBlockDown.uid;
      }
      if(currentBlock.content !== action.payload.event.target.value) {
        currentBlock.content = action.payload.event.target.value;
        savePage(page);
      }
    },
    blockBackspaceKeyPressed: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      const flattenedBlocks = flattenBlocks(page.blocks);
      const uidBlockMap = getUidBlockMap(flattenedBlocks);
      const currentBlock = uidBlockMap[action.payload.block.uid];
      const nextBlockUp = getNextBlockUp(currentBlock, uidBlockMap);
      if(nextBlockUp) {
        kgraph.focusedBlock.caretPos = nextBlockUp.content.length;
        kgraph.focusedBlock.uid = nextBlockUp.uid;
        nextBlockUp.content += currentBlock.content;
        removeBlockFromPage(currentBlock, uidBlockMap, page);
        savePage(page);
      }
    },
    pageIconSelected: (state, action) => {
      const kgraph = state.kgraph;
      const page = kgraph.pageMap.get(action.payload.pageUid);
      if(page && action.payload.icon && action.payload.icon.type === 'emoji') {
        page.icon = `u${action.payload.icon.unicode}`;
        savePage(page);
      }
    },
    createNewPage: (state, action) => {
      const newPage = new Page();
      const kgraph = state.kgraph;
      newPage.setPage({
        uid: uuid(),
        title: action.payload.title,
        blocks: [{
          uid: uuid(),
          content: ''
        }],
        icon: null,
        cover: null,
        is_outliner: true
      });
      state.newlyAddedPageUid = newPage.uid;
      createPage(newPage, path.join(kgraph.pathname, `${newPage.slug}.yml`));
    }
  }
});

export const {
  openKgraphEvent,
  addFileEvent,
  changeFileEvent,
  pageTitleChanged,
  focusBlock,
  collapseBlock,
  togglePageOutliner,
  onBlockBlur,
  blockEnterKeyPressed,
  blockTabKeyPressed,
  blockUpKeyPressed,
  blockDownKeyPressed,
  blockBackspaceKeyPressed,
  pageIconSelected,
  createNewPage
} = kgraphSlice.actions;

export default kgraphSlice.reducer;
