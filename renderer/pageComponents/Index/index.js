import React from 'react';
import Sidebar from 'components/Sidebar';
import useHypergraphTreeSync from './useHypergraphTreeSync';
import StyledWrapper from './StyledWrapper';

export default function Main() {
  useHypergraphTreeSync();

  return (
    <div>
      <StyledWrapper>
        Hello Electron!
        <Sidebar />
      </StyledWrapper>
    </div>
  );
};

