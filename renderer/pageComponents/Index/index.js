import React from 'react';
import useNotebaseTreeSync from './useNotebaseTreeSync';
import StyledWrapper from './StyledWrapper';

export default function Main() {
  useNotebaseTreeSync();

  return (
    <div>
      <StyledWrapper>
        Hello Electron!
      </StyledWrapper>
    </div>
  );
};

