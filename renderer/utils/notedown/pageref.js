import * as A from "arcsecond";

const begin = A.str("[[");
const end = A.str("]]");

const pageref = A
  .between(begin)(end)(A.everyCharUntil(end))
  .map((result) => {
    return {
      tag: 'pageref',
      content: result
    };
  });

export default pageref;