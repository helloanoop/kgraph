import * as A from "arcsecond";

const LINK_REGEX = /^\[(.*?)\]\((.*?)\)/gim;

const extractText = () => {
  const begin = A.str("[");
  const end = A.str("](");
  const parser = A.between(begin)(end)(A.everyCharUntil(end));
  return parser;
};

const extractHref = () => {
  const end = A.str(")");
  const parser = A.everyCharUntil(end);
  return parser;
};

const extractLinkTextHref = (input) => {
  return A
    .sequenceOf([
      extractText(),
      extractHref()
    ])
    .run(input);
};

const image = A
  .regex(LINK_REGEX)
  .map((result) => {
    const extracted  = extractLinkTextHref(result);

    if(extracted && !extracted.isError && extracted.result && extracted.result.length === 2) {
      return {
        tag: 'a',
        text: extracted.result[0],
        href: extracted.result[1]
      };
    }

    return {
      tag: 'span',
      content: '(Invalid Image URL)'
    };
  });

export default image;
