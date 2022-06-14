import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from 'next/router';
import unionBy from 'lodash/unionBy';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { getWordCountInPage } from 'utils/kgraph';
import StyledWrapper from './StyledWrapper';

const AllPages = () => {
//   const router = useRouter();
  const kgraph = useSelector((state) => state.kgraph.kgraph);

  const {
    pageMap
  } = kgraph;

  let [pages, setPages] = useState([]);
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    if(page && pageMap) {
      setPages((prevNotes) => {
        let newNotes = [...pageMap].slice(page*10-10, (page*10));
        let pages = [...prevNotes, ...newNotes];

        // todo: fix this bug
        pages = unionBy(pages, (p) => p[1].uid);

        return pages;
      });
      setHasMore([...pageMap].slice(page*10-10, page*10).length > 0);
    }
  }, [page, pageMap]);

  const lastPageRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting & hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const handlePageClick = (e, page) => {
    console.log('page clicked');
    // router.push(`/n/${notebaseName}/${page.uid}`);
  };

  return (
    <StyledWrapper>
      <h3 className="all-pages-title pb-6">All Notes</h3>
      <table className="table notebase-all-pages table-auto border-collapse w-full mb-32 px-2 py-2">
        <thead>
          <tr className="rounded-lg text-sm font-medium">
            <th className="text-left pr-2 py-2">Title</th>
            <th className="px-2 py-2">Words</th>
            <th className="text-right px-2 py-2">Created At</th>
            <th className="text-right px-2 py-2">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {(pages && pages.length) ? pages.map((entry, index) => {
            let page = entry[1];
            if (pages.length === index + 1) {
              return (
                <tr key={page.uid} ref={lastPageRef}>
                  <td
                    className="page-title cursor-pointer pr-2 py-2"
                    onClick={(e) => handlePageClick(e, page)}
                  >{page.title}</td>
                  <td className="text-center word-count px-2 py-2">{getWordCountInPage(page) || 0}</td>
                  <td className="text-right created-at px-2 py-2">{format(new Date(page.created_at), "d MMM yyyy")}</td>
                  <td className="text-right updated-at px-2 py-2">{format(new Date(page.updated_at), "d MMM yyyy")}</td>
                </tr>
              )
            }
            return (
              <tr key={page.uid}>
                <td
                  className="page-title cursor-pointer pr-2 py-2"
                  onClick={(e) => handlePageClick(e, page)}
                >{page.title}</td>
                <td className="text-center word-count text-gray-600 px-2 py-2">{getWordCountInPage(page) || 0}</td>
                <td className="text-right created-at px-2 py-2">{format(new Date(page.created_at), "d MMM yyyy")}</td>
                <td className="text-right updated-at px-2 py-2">{format(new Date(page.updated_at), "d MMM yyyy")}</td>
              </tr>
            );
          }) : null}
        </tbody>
      </table>
    </StyledWrapper>
  );
};

export default AllPages;
