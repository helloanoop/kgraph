import * as A from "arcsecond";

// Anything between ~~
const block = A.str("~~");

const strikeThrough = A
  .between(block)(block)(A.everyCharUntil(block))
  .map((result) => {
    return {
      tag: 'del',
      content: result
    };
  });

export default strikeThrough;
