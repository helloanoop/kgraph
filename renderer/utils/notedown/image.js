import * as A from "arcsecond";

const IMG_REGEX = /^!\[(.*?)\]\((.*?)\)/gim;

const extractAlt = () => {
  const begin = A.str("![");
  const end = A.str("](");
  const parser = A.between(begin)(end)(A.everyCharUntil(end));
  return parser;
};

const extractSrc = () => {
  const end = A.str(")");
  const parser = A.everyCharUntil(end);
  return parser;
};

const extractImageAltSrc = (input) => {
  return A
    .sequenceOf([
      extractAlt(),
      extractSrc()
    ])
    .run(input);
};

const image = A
  .regex(IMG_REGEX)
  .map((result) => {
    const extracted  = extractImageAltSrc(result);

    if(extracted && !extracted.isError && extracted.result && extracted.result.length === 2) {
      return {
        tag: 'img',
        alt: extracted.result[0],
        src: extracted.result[1]
      };
    }

    return {
      tag: 'span',
      content: '(Invalid Image URL)'
    };
  });

export default image;
