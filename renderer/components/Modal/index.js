import React, {useState, useEffect} from 'react';
import StyledWrapper from './StyledWrapper';

const ModalHeader = ({title, handleClose}) => (
  <div className="notebase-modal-header">
    {title ? <div className="notebase-modal-heade-title">{title}</div> : null}
    {handleClose ? (
      <div className="close cursor-pointer" onClick={handleClose ? () => handleClose() : null}>
        ×
      </div>
    ) : null}
  </div>
);

const ModalContent = ({children}) => <div className="notebase-modal-content px-4">{children}</div>;

const ModalFooter = ({handleSubmit, handleCancel, saveText, cancelText}) => {
  saveText = saveText || 'Save';
  cancelText = cancelText || 'Cancel';

  return (
    <div className="flex justify-end p-4 notebase-modal-footer">
      <span className="mr-2">
        <button type="button" onClick={handleCancel} className="btn btn-sm btn-close">
          {cancelText}
        </button>
      </span>
      <span className="">
        <button className="btn btn-sm btn-secondary" onClick={handleSubmit} >
          {saveText}
        </button>
      </span>
    </div>
  );
}

const Modal = ({
  children,
  size,
  isClosing,
  handleClose
}) => {
  const escFunction = (event) => {
    const escKeyCode = 27;
    if (event.keyCode === escKeyCode) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    }
  }, []);

  let classes = 'notebase-modal';
  if (isClosing) {
    classes += ' modal--animate-out';
  }
  return (
    <StyledWrapper className={classes}>
      <div className={`notebase-modal-card modal-${size}`}>
        {children}
      </div>
      <div className="notebase-modal-backdrop" onClick={handleClose} />
    </StyledWrapper>
  );
};

export default Modal;

export {ModalHeader, ModalContent, ModalFooter};
