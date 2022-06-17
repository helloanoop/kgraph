import React from 'react';

const Heading = ({el}) => {
  if(el.tag === 'h1') {
    return <h1>{el.content}</h1>;
  }

  if(el.tag === 'h2') {
    return <h2>{el.content}</h2>;
  }

  if(el.tag === 'h3') {
    return <h3>{el.content}</h3>;
  }
};

export default Heading;
