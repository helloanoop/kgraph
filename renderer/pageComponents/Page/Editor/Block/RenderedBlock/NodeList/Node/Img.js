import React from 'react';
import {sanitizeUrl} from '@braintree/sanitize-url';
import DOMPurify from 'dompurify';
import * as A from "arcsecond";

const extractSrcFromSanitizedMarkup = (markup) => {
  const begin = A.str('<img src="');
  const end = A.sequenceOf([
    A.str('">'),
    A.endOfInput
  ]);
  const parser = A.between(begin)(end)(A.everyCharUntil(end));

  return parser.run(markup).result;
}

const Img = ({el}) => {
  let src = el.src;
  let alt = el.alt;

  // 1st layer of xss protection
  let sanitizedSrc = sanitizeUrl(src);

  // 2nd layer of xss protection
  let sanitizedImgMarkup = DOMPurify.sanitize(`<img src="${sanitizedSrc}">`);
  let sanitizedSrc2 = extractSrcFromSanitizedMarkup(sanitizedImgMarkup);

  return <img src={sanitizedSrc2} alt={alt}/>;
}

export default Img;
