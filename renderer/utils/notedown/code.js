import * as A from "arcsecond";

// Anything between ```
const block = A.str("```");

const code = A
  .between(block)(block)(A.everyCharUntil(block))
  .map((result) => {
    return {
      tag: 'code',
      content: result
    };
  });

export default code;
