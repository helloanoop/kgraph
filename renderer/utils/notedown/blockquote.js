
import * as A from "arcsecond";
import startOfInput from './arcsecond/startOfInput';

const newline = A.lookAhead(A.str("\n"));
const newLineOrEndOfInput = A.choice([A.endOfInput, newline]);

const mustBeginWithBlockquote = A.sequenceOf([
  startOfInput,
  A.str("> ")
]);

// > followed by space followed by any chars till \n or EOL
const blockquote = A
  .between(mustBeginWithBlockquote)(newLineOrEndOfInput)(A.everyCharUntil(newLineOrEndOfInput))
  .map((result) => {
    return {
      tag: 'blockquote',
      content: result
    };
  });

export default blockquote;
