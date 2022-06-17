import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
  color: rgb(0 87 188);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Pageref = ({el, handlePageRefClick}) => {
  return <StyledSpan onClick={(e) => handlePageRefClick(e, el.content)}>{el.content}</StyledSpan>;
};

export default Pageref;
