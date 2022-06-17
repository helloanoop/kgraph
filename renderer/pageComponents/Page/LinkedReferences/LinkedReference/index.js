import React from 'react';
import PropTypes from 'prop-types';
import StyledWrapper from './StyledWrapper';
import { useStore } from 'providers/Store';
import RenderedBlock from 'pageComponents/Page/Editor/Block/RenderedBlock';
import each from 'lodash/each';
import find from 'lodash/find';
import { slugify } from 'utils/text';
import { useRouter } from 'next/router';
import { flattenBlocks, extractPageRefs } from 'providers/Store/utils';

const LinkedReference = ({title, pageUid, currentPageTitle}) => {
  const router = useRouter();
  const [state] = useStore();
  const {
    pageMap,
    notebaseName,
  } = state;

  const page = pageMap.get(pageUid);
  const flattenedBlocks = flattenBlocks(page.blocks);
  const linkedBlocks = [];

  each(flattenedBlocks, (block) => {
    let pagrefs = extractPageRefs(block);
    if(pagrefs && pagrefs.length) {
      let linkFound = find(pagrefs, (r) => {
        return slugify(currentPageTitle) === slugify(r);
      });
      if(linkFound) {
        linkedBlocks.push(block);
      }
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();

    // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
    if(event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }

    router.push(`/n/${notebaseName}/${pageUid}`);
  };

  return (
    <StyledWrapper>
      <div className="linkedref">
        <div className="mb-1 link-title" style={{color: 'rgb(0 87 188)'}}  onClick={(e) => handleClick(e)}>
          {title}
        </div>
        {linkedBlocks && linkedBlocks.length ? linkedBlocks.map((block) => {
          return (
            <div key={block.uid} className="linked-block ml-2 mb-2">
              <RenderedBlock block={block} onEdit={() => {}}/>
            </div>
          );
        }) : null}
      </div>
    </StyledWrapper>
  );
};

LinkedReference.propTypes = {
  pageUid: PropTypes.string.isRequired,
  currentPageTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default LinkedReference;
