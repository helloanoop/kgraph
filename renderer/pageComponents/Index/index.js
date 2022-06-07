import React from 'react';
import useHypergraphTreeSync from './useHypergraphTreeSync';
import StyledWrapper from './StyledWrapper';

export default function Main() {
  useHypergraphTreeSync();

  return (
    <div>
      <StyledWrapper>
        Hello Electron!
      </StyledWrapper>
    </div>
  );
};

