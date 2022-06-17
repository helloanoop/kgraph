import React from 'react';

const Checkbox = ({el}) => {
  if(el.content) {
    return <input type="checkbox" checked={true} readOnly/>;
  } else {
    return <input type="checkbox" readOnly/>;
  }
};

export default Checkbox;
