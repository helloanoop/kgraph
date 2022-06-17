import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Switch from "react-switch";
import { IconTrash, IconList, IconMoodSmile } from '@tabler/icons';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { pageIconSelected, togglePageOutliner } from 'providers/Store/slices/kgraph';
import PageIcon from '../PageIcon';
import StyledWrapper from './StyledWrapper';

const PageOptionDropdown = ({isOpen, onClose, position, page}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const popOverRef = useRef(null);
  const [pageIconOpen, setPageIconOpen] = useState(false);

  useOnClickOutside(popOverRef, (e) => onClose());

  const left = position === 'right' ? 'inherit' : '-125px';

  const handleOutline = () => {
    dispatch(togglePageOutliner({
      pageUid: page.uid
    }));
  };

  const handlePageIconClick = () => {
    setPageIconOpen(true);
    onClose();
  };

  const handlePageIconClose = () => setPageIconOpen(false);

  const handlePageIconSelect = (icon) => {
    dispatch(pageIconSelected({
      icon: icon,
      pageUid: page.uid
    }));
    setPageIconOpen(false);
  };

  const handlePageDelete = () => {
    // dispatch({
    //   type: actions.DELETE_PAGE,
    //   noteUid: page.uid
    // });
    setPageIconOpen(false);
    router.push(`/index`);
  };

  const isIndexPage = page.slug === 'index';

  return (
    <StyledWrapper onMouseLeave={onClose} style={{left}}>
      {pageIconOpen && <PageIcon handleClose={handlePageIconClose} handleSelect={handlePageIconSelect}/>}
      {isOpen && (
        <div className="popover" ref={popOverRef}>
          <div className="popover-content select-none">
            <div className="dropdown-item" onClick={handleOutline}>
              <IconList size={20} strokeWidth={1.5} className="icon mr-2" />
              <span className="inline mr-2">Outline</span>
              <Switch
                onChange={() => {}}
                checked={!page.is_outliner}
                onColor="#b3b3b3"
                onHandleColor="#2f3037"
                handleDiameter={10}
                height={10}
                width={20}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.3)"
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </div>
            <div className="dropdown-item" onClick={handlePageIconClick}>
              <IconMoodSmile size={20} strokeWidth={1.5} className="icon mr-2" />
              Icon
            </div>
            {!isIndexPage ? (
              <div className="dropdown-item" onClick={handlePageDelete}>
                <IconTrash size={20} strokeWidth={1.5} className="icon mr-2" />
                Delete
              </div>
            ) : null}
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

PageOptionDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
  page: PropTypes.object.isRequired
};

export default PageOptionDropdown;
