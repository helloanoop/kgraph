import React from "react";
import classnames from 'classnames';
import RenderedBlock from './RenderedBlock';
import EditingBlock from './EditingBlock';
import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from 'react-redux';
import { focusBlock, collapseBlock } from 'providers/Store/slices/kgraph';
import StyledWrapper from './StyledWrapper';

const Block = ({
  block,
  focusedBlock,
  pageUid,
  caller
}) => {
  const dispatch = useDispatch();
  const isEditing = focusedBlock.uid === block.uid;
  
  const editBlock = (event) => {
    const selection = window.getSelection();
    dispatch(focusBlock({
      pageUid: pageUid,
      block: block,
      caretPosition: selection.anchorOffset
    }));
  };

  const handleCollapseClick = () => {
    if(block.blocks && block.blocks.length) {
      dispatch(collapseBlock({
        pageUid: pageUid,
        block: block
      }));
    }
  };

  // block left padding, root blocks don't have left padding
  let paddingLeft = 0;
  if(block.parent) {
    paddingLeft = 20;
  }

  let folderArrowClassNames = classnames('folder-arrow', {
    'collapsed': block.collapsed,
    'can-collapse': block.blocks && block.blocks.length
  });

  return (
    <StyledWrapper className="notebase-block-container" style={{paddingLeft: `${paddingLeft}px`}}>
      <div className="flex relative notebase-block-content-container">
        <span className='notebase-block-bullet'>
          <span  className={`bullet-outer ${block.collapsed ? 'collapsed' : ''}`}>
            <span className="bullet-inner"></span>
          </span>
        </span>
        <span className={folderArrowClassNames} onClick={handleCollapseClick}>
          <FontAwesomeIcon className="cursor-pointer" icon={block.collapsed ? faCaretRight : faCaretDown}/>
        </span>
        {isEditing ? (
          <EditingBlock
            block={block}
            pageUid={pageUid}
            focusedBlock={focusedBlock}
          />
        ) : (
          <RenderedBlock block={block} onEdit={editBlock}/>
        )}
      </div>
      {block.blocks && block.blocks.length && !block.collapsed ? block.blocks.map(childblock => {
        return (
          <Block
            key={childblock.uid}
            block={childblock}
            pageUid={pageUid}
            focusedBlock={focusedBlock}
            caller={caller}
          />
        );
      }) : null}
    </StyledWrapper>
  );
};

export default Block;
