import React, {useState, useEffect} from 'react';
import StyledWrapper from './StyledWrapper';

const ModalHeader = ({title, handleCancel}) => (
  <div className="notebase-modal-header">
    {title ? <div className="notebase-modal-heade-title">{title}</div> : null}
    {handleCancel ? (
      <div className="close cursor-pointer" onClick={handleCancel ? () => handleCancel() : null}>
        ×
      </div>
    ) : null}
  </div>
);

const ModalContent = ({children}) => (
  <div className="notebase-modal-content px-4 py-6">
    {children}
  </div>
);

const ModalFooter = ({confirmText, handleSubmit, handleCancel, confirmDisabled}) => {
  return (
    <div className="flex justify-end p-4 notebase-modal-footer">
      <span className="mr-2">
        <button type="button" onClick={handleCancel} className="btn btn-sm btn-close">
          Cancel
        </button>
      </span>
      <span className="">
        <button type="submit" className="submit btn btn-sm btn-secondary" disabled={confirmDisabled} onClick={handleSubmit} >
          {confirmText}
        </button>
      </span>
    </div>
  );
}

const ConfirmModal = ({
  size,
  title,
  confirmText,
  handleCancel,
  handleConfirm,
  children,
  confirmDisabled
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const escFunction = (event) => {
    const escKeyCode = 27;
    if (event.keyCode === escKeyCode) {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => handleCancel(), 500);
  }

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
        <ModalHeader title={title} handleCancel={() => closeModal()} />
        <ModalContent>{children}</ModalContent>
        <ModalFooter 
          confirmText={confirmText} 
          handleCancel={() => closeModal()} 
          handleSubmit={handleConfirm} 
          confirmDisabled={confirmDisabled}
        />
      </div>
      <div className="notebase-modal-backdrop" onClick={() => closeModal()} />
    </StyledWrapper>
  );
};

export default ConfirmModal;

export {ModalHeader, ModalContent};
