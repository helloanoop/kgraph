import * as A from "arcsecond";

import bold from "./bold";
import anything from "./anything";
import headings from "./headings";
import blockquote from "./blockquote";
import italic from "./italic";
import strikeThrough from "./strikeThrough";
import code from "./code";
import image from "./image";
import link from "./link";
import checkbox from "./checkbox";
import arrowright from "./arrow-right";
import pageref from "./pageref";

const choice = A.choice;
const many = A.many;

const notedown = (input) => {
  return many(
    choice([
      blockquote,
      headings,
      arrowright,
      pageref,
      bold,
      italic,
      strikeThrough,
      code,
      image,
      link,
      checkbox,
      anything
    ])
  )
  .run(input)
  .result
  .reduce((memo, r) => {
    // this happens when an "anything" is matched
    if(typeof r === 'string') {
      r = {
        tag: 'span',
        content: r
      }; 
    }

    if(!memo.length || r.tag !== 'span') {
      memo.push(r);
      return memo;
    }

    // concatentate consecutive span tags
    let currentTag = memo[memo.length - 1];

    if(currentTag.tag === 'span') {
      currentTag.content += r.content;
    } else {
      memo.push(r);
    }

    return memo;
  }, []);
};

export default notedown;
