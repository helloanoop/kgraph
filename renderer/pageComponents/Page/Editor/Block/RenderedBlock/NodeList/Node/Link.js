import React from 'react';
import {sanitizeUrl} from '@braintree/sanitize-url';
import DOMPurify from 'dompurify';
import * as A from "arcsecond";

const extractHrefFromSanitizedMarkup = (markup) => {
  const begin = A.str('<a href="');
  const end = A.sequenceOf([
    A.str('">TEXT</a>'),
    A.endOfInput
  ]);
  const parser = A.between(begin)(end)(A.everyCharUntil(end));

  return parser.run(markup).result;
}

const Link = ({el}) => {
  let text = el.text;
  let href = el.href;

  // 1st layer of xss protection
  let sanitizedHref = sanitizeUrl(href);

  // 2nd layer of xss protection
  let sanitizedLinkMarkup = DOMPurify.sanitize(`<a href="${sanitizedHref}">TEXT</a>`);
  let sanitizedHref2 = extractHrefFromSanitizedMarkup(sanitizedLinkMarkup);

  return <a href={sanitizedHref2}>{text}</a>;
}

export default Link;
