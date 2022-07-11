import datascript from 'datascript';
import each from 'lodash/each';
import path from 'path';
import { slugify } from 'utils/text';
import { createPage } from 'utils/ipc';
import { uuid } from 'utils/common';
import { extractPageRefs, flattenBlocks } from 'utils/kgraph';
import Page from 'providers/Store/models/Page';

if(process.browser && process.env.NEXT_PUBLIC_ENV === 'dev') {
  window.ds = datascript;
}

// datascript :db/id generator
let __dsid = 0;
export const dsid = () => {
  return ++__dsid;
};

export const createConnection = () => {
  const kgraphSchema = {
    ':page/title': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/uid': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/slug': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/refs': {
      ':db/cardinality': ':db.cardinality/many',
      ':db/valueType': ':db.type/ref'
    }
  };

  const connection = datascript.create_conn(kgraphSchema);
  if(process.browser && process.env.NEXT_PUBLIC_ENV === 'dev') {
    window.dc = connection;
  }

  return connection;
};

export const loadPageIntoDatascript = (dsConnection, kgraph, page) => {
  // load data into datascript
  let datoms = [];
  datoms.push({
    ':db/id': page.dsid,
    ':page/title': page.title,
    ':page/uid': page.uid,
    ':page/slug': page.slug
  });
  datascript.transact(dsConnection, datoms);
};

export const checkPagerefsAndAddPageIfNotFound = (dsConnection, block, page, kgraph) => {
  let pagerefs = extractPageRefs(block);
  let pagerefDatoms = [];
  each(pagerefs, (pr) => {
    if(pr && pr.length && typeof pr === 'string') {
      let slug = slugify(pr);
      let reffedNoteUid = kgraph.pageSlugMap.get(slug);
      if(reffedNoteUid) {
        let reffedNote = kgraph.pageMap.get(reffedNoteUid);
        pagerefDatoms.push({
          ':db/id': page.dsid,
          ':page/refs': reffedNote.dsid
        });
      } else {
        addNewPage(dsConnection, kgraph, pr);
      }
    }
  });

  if(pagerefDatoms.length) {
    datascript.transact(dsConnection, pagerefDatoms);
  }
};

export const addNewPage = (dsConnection, kgraph, title, options = {}) => {
  let newPage = new Page();
  newPage.setPage({
    uid: uuid(),
    title: title,
    blocks: [{
      uid: uuid(),
      content: ''
    }],
    icon: null,
    cover: null,
    is_daily: options.is_daily ? true : false
  });
  newPage.dsid = dsid();

  kgraph.pageMap.set(newPage.uid, newPage);
  kgraph.pageSlugMap.set(newPage.slug, newPage.uid);
  createPage(newPage, path.join(kgraph.pathname, `${newPage.slug}.yml`));

  return newPage;
};