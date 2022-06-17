import * as A from "arcsecond";

// Anything between **
const block = A.str("**");

const bold = A
  .between(block)(block)(A.everyCharUntil(block))
  .map((result) => {
    return {
      tag: 'b',
      content: result
    };
  });

export default bold;