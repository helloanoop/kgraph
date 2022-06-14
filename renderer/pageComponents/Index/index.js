import React from 'react';
import Sidebar from 'components/Sidebar';
import StyledWrapper from './StyledWrapper';

export default function Main() {
  return (
    <div>
      <StyledWrapper>
        Hello Electron!
        <Sidebar />
      </StyledWrapper>
    </div>
  );
};

