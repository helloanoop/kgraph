import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import StyledWrapper from './StyledWrapper';

const ToastContent = ({type, text, handleClose}) => (
  <div className={`alert alert-${type}`} role="alert">
    <div> {text} </div>
    <div onClick={handleClose} className="closeToast"> 
      <FontAwesomeIcon size="xs" icon={faTimes}/>
    </div>
  </div>
);

const Toast = ({
  text,
  type,
  duration,
  handleClose
}) => {
  let lifetime = duration ? duration : 2500;

  useEffect(() => {
    if(text) {
      setTimeout(handleClose, lifetime);
    }
  }, [text]);

  return (
    <StyledWrapper className='kgraph-toast'>
      <div className='kgraph-toast-card'>
        <ToastContent type={type} text={text} handleClose={handleClose}></ToastContent>
      </div>
    </StyledWrapper>
  );
};

export default Toast;
