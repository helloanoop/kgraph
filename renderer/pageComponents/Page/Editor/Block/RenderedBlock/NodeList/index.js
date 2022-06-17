import React from 'react';
import Node from './Node';

const NodeList = ({list, handlePageRefClick}) => {
  return (
    <div>
      {(list && list.length) ? list.map((el, index) => (
        <Node el={el} key={index} handlePageRefClick={handlePageRefClick}/>
      )) : null}
    </div>
  );;
}

export default NodeList;
