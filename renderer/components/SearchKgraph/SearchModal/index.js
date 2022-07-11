import React, {useState, useEffect} from 'react';
import StyledWrapper from './StyledWrapper';

const ModalContent = ({children}) => <div className="kgraph-modal-content">{children}</div>;

const Modal = ({
  title,
  children,
  size,
  handleClose,
  handleSubmit
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
    setTimeout(() => handleClose(), 500);
  }

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    }
  }, []);

  let classes = 'kgraph-modal';
  if (isClosing) {
    classes += ' modal--animate-out';
  }
  return (
    <StyledWrapper className={classes}>
      <div className={`kgraph-modal-card modal-${size}`}>
        <ModalContent>{children}</ModalContent>
      </div>
      <div className="kgraph-modal-backdrop" onClick={() => closeModal()} />
    </StyledWrapper>
  );
};

export default Modal;

export {ModalContent};
