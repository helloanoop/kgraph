import React from 'react'
import StyledWrapper from './StyledWrapper';

const PageIcon = ({page}) => {
  console.log("here");
  console.log(page);
  if(!page || !page.icon || !page.icon.length) {
    return null;
  }

  if(typeof page.icon !== 'string') {
    return null;
  }

  const isUnicode = page.icon.charAt(0) === 'u';
  console.log(page.icon.charAt(0));

  if(!isUnicode) {
    return null;
  }

  return (
    <StyledWrapper className="page-icon-container mb-4">
      {isUnicode && (
        <span className="page-icon">{String.fromCodePoint(parseInt (page.icon.substring(1), 16))}</span>
      )}
    </StyledWrapper>
  )
}

export default PageIcon;
