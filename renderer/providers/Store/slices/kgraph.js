import path from 'path';
import { createSlice } from '@reduxjs/toolkit';
import { isPageTitleADate, slugify } from 'utils/text';
import { dsid } from 'utils/datascript';
import Page from '../models/Page';

const initialState = {
  kgraph: {}
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
        pageSlugMap: new Map()
      };
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
          is_outliner: file.data.is_outliner,
          is_daily: isPageTitleADate(file.data.title),
          slug: slugify(file.data.title),
          word_count: 0
        });
        page.dsid = dsid();
        state.kgraph.pageMap.set(page.uid, page);
        state.kgraph.pageSlugMap.set(page.slug, page.uid);
      }
    }
  }
});

export const {
  openKgraphEvent,
  addFileEvent
} = kgraphSlice.actions;

export default kgraphSlice.reducer;
