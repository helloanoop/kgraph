import * as A from "arcsecond";
import startOfInput from './arcsecond/startOfInput';

const todo = A.sequenceOf([
    startOfInput,
    A.str("[ ]")
  ])
  .map((result) => {
    return {
      tag: 'checkbox',
      content: false
    };
  });

const done = A.sequenceOf([
    startOfInput,
    A.choice([
      A.str("[x]"),
      A.str("[X]")
    ])
  ])
  .map((result) => {
    return {
      tag: 'checkbox',
      content: true
    };
  });

const checkbox = A.choice([todo, done]);

export default checkbox;
