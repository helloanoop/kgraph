import React, { useMemo } from 'react';
import {slugify} from 'utils/text';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import parseNotedown from 'utils/notedown';
import NodeList from './NodeList';

const RenderedBlock = ({block, onEdit}) => {
  const router = useRouter();
  const kgraph = useSelector((state) => state.kgraph.kgraph);
  const {
    pageSlugMap,
  } = kgraph;

  const handlePageRefClick = (event, pageTitle) => {
    event.stopPropagation();

    // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
    if(event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }

    let slug = slugify(pageTitle);
    let pageUid = pageSlugMap.get(slug);

    if(pageUid) {
      router.push(`/${pageUid}`);
    }
  };

  // parsing is a computationally expensive operation
  const parsedNodeTree = useMemo(() => {
    if(block && block.content) {
      return parseNotedown(block.content);
    }

    return null;
  }, [block.content]);

  return (
    <div className="notebase-block-content markdown" onClick={onEdit}>
      <NodeList list={parsedNodeTree} handlePageRefClick={handlePageRefClick}/>
    </div>
  );
};

export default RenderedBlock;
