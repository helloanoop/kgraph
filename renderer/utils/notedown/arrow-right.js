
import * as A from "arcsecond";

const newline = A.lookAhead(A.str("\n"));
const newLineOrEndOfInput = A.choice([A.endOfInput, newline]);

// -> followed by space followed by any chars till \n
const arrowRight = A
  .between(A.str("-> "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'arrowright',
      content: result
    };
  });

export default arrowRight;