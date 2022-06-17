
import * as A from "arcsecond";

const newline = A.lookAhead(A.str("\n"));
const newLineOrEndOfInput = A.choice([A.endOfInput, newline]);

// # followed by space followed by any chars till \n
const h1 = A
  .between(A.str("# "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'h1',
      content: result
    };
  });

// ## followed by space followed by any chars till \n
const h2 = A
  .between(A.str("## "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'h2',
      content: result
    };
  });

// ### followed by space followed by any chars till \n
const h3 = A
  .between(A.str("### "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'h3',
      content: result
    };
  });

// #### followed by space followed by any chars till \n
const h4 = A
  .between(A.str("#### "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'h4',
      content: result
    };
  });

// ##### followed by space followed by any chars till \n
const h5 = A
  .between(A.str("##### "))(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'h5',
      content: result
    };
  });

const heading = A.choice([h1, h2, h3, h4, h5]);

export default heading;