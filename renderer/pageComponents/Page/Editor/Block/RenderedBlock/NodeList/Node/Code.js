import React from 'react';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';

const Code = ({content}) => {
  if(typeof content !== 'string') {
    return;
  }

  // replace any ENTER char at beginning.
  content = content.replace(/^(\r\n|\n|\r)/g,"");

  const highlightedCode = hljs.highlight(content, {language: 'javascript'}).value;
  let sanitizedMarkup = DOMPurify.sanitize(highlightedCode);

  return <div className="hljs p-3" style={{borderRadius: '2px'}} dangerouslySetInnerHTML={{__html: sanitizedMarkup}}></div>;
};

export default Code;
