import React from 'react';
import {IconArrowNarrowRight} from '@tabler/icons';

const ArrowRight = ({el}) => {
  return (
    <div className="flex items-center arrow-right" style={{marginTop: '-6px', marginBottom: '-6px'}}>
      <IconArrowNarrowRight size={20} strokeWidth={1.5} className="ml-2 mr-1"/>
      <span>{el.content}</span>
    </div>
  );
};

export default ArrowRight;
