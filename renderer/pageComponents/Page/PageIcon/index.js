import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Modal, {ModalContent, ModalFooter } from 'components/Modal';
import { Tab, TabList, TabPanel } from 'react-tabs';
import EmojiPicker from 'components/EmojiPicker';
import StyledWrapper from './StyledWrapper';

const Tabs = dynamic(import('react-tabs').then(mod => mod.Tabs), { ssr: false });

const PageIcon = ({handleClose, handleSelect}) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [isModalClosing, setModalIsClosing] = useState(false);

  const handleModalClose = () => {
    setModalIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      handleClose();
    }, 100);
  };

  const handleEmojiSelect = (icon) => {
    setModalIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      handleSelect(icon);
    }, 100);
  };

  const handleSubmit = () => setModalOpen(false);

  return (
    <StyledWrapper>
      {modalOpen && (
        <Modal handleClose={handleModalClose} isClosing={isModalClosing} size="md">
          <ModalContent>
            <Tabs defaultIndex={0} >
              <TabList>
                <Tab>Emoji</Tab>
                {/* <Tab>Link</Tab> */}
              </TabList>
              <TabPanel>
                <EmojiPicker handleSelect={handleEmojiSelect}/>
              </TabPanel>
              {/* <TabPanel>
                Link
              </TabPanel> */}
            </Tabs>
          </ModalContent>
          <ModalFooter handleCancel={handleModalClose} handleSubmit={handleSubmit}/>
        </Modal>
      )}
    </StyledWrapper>
  );
};

export default PageIcon;
