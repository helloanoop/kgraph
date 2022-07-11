import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Title from './Title';
import Block from './Block';
import PageIcon from './PageIcon';
import LinkedReferences from '../LinkedReferences';
import StyledWrapper from './StyledWrapper';

const Editor = ({page, blocks, focusedBlock, pageUid, caller}) => {
  let classNames = classnames('notebase-editor px-8', {
    'is-outliner': page.is_outliner
  });

  return (
    <StyledWrapper className={classNames}>
      <PageIcon page={page}/>
      <Title page={page} pageUid={pageUid} caller={caller}/>
      {blocks && blocks.map(block => {
        return <Block 
          key={block.uid}
          block={block}
          pageUid={pageUid}
          focusedBlock={focusedBlock}
          caller={caller}
        />
      })}
      <LinkedReferences pageUid={pageUid}/>
    </StyledWrapper>
  );
}

Editor.propTypes = {
  page: PropTypes.object.isRequired,
  blocks: PropTypes.array.isRequired,
  pageUid: PropTypes.string.isRequired
};

export default Editor;
