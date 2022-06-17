import * as A from "arcsecond";

// Anything between *
const block = A.str("*");

const italic = A
  .between(block)(block)(A.everyCharUntil(block))
  .map((result) => {
    return {
      tag: 'i',
      content: result
    };
  });

export default italic;
