import _ from 'lodash';
import React from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { IconAlertTriangle } from '@tabler/icons';
import Editor from "./Editor";
import StyledWrapper from './StyledWrapper';

const Page = () => {
  const router = useRouter();
  const pageUid = router.query.pageUid;
  const kgraph = useSelector((state) => state.kgraph.kgraph);

  const {
    pageMap,
    focusedBlock
  } = kgraph;

  if(!pageMap) {
    return (<div></div>);
  }

  const page = pageMap.get(pageUid);

  if(process.env.NEXT_PUBLIC_ENV === 'dev') {
    console.log("debug: rendering page");
  }

  if(!page || !page.uid) {
    return (
      <StyledWrapper>
        <div className="flex mt-10 mb-5 pr-6 items-center justify-center" style={{color: 'rgb(192 69 8)'}}>
          <IconAlertTriangle size={24} strokeWidth={2}/>
          <span className="ml-2">The page was not found</span>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <Editor
        page={page}
        blocks={page.blocks}
        focusedBlock={focusedBlock}
        pageUid={pageUid}
        caller='page'
      />
    </StyledWrapper>
  );
};

export default Page;