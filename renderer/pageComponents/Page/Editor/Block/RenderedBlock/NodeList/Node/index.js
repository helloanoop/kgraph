import React from 'react';
import Heading from './Heading';
import ArrowRight from './ArrowRight';
import Img from './Img';
import Link from './Link';
import Code from './Code';
import Checkbox from './Checkbox';
import Pageref from './Pageref';

const Node = ({el, handlePageRefClick}) => {
  if(['h1', 'h2', 'h3'].includes(el.tag)) {
    return <Heading el={el}/>;
  }
  if(el.tag === 'arrowright') {
    return <ArrowRight el={el}/>;
  }

  if(el.tag === 'b') {
    return <b>{el.content}</b>;
  }

  if(el.tag === 'blockquote') {
    return <blockquote>{el.content}</blockquote>;
  }

  if(el.tag === 'i') {
    return <i>{el.content}</i>;
  }

  if(el.tag === 'del') {
    return <del>{el.content}</del>;
  }

  if(el.tag === 'code') {
    return <Code content={el.content} />;
  }

  if(el.tag === 'checkbox') {
    return <Checkbox el={el}/>;
  }

  if(el.tag === 'img') {
    return <Img el={el}/>;
  }

  if(el.tag === 'a') {
    return <Link el={el}/>;
  }

  if(el.tag === 'pageref') {
    return <Pageref el={el} handlePageRefClick={handlePageRefClick}/>;
  }

  if(el.tag === 'span') {
    return <span>{el.content}</span>;
  }

  return <span>{el.content}</span>;
}

export default Node;
