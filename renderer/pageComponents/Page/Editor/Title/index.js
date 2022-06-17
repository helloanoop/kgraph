import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Toast from 'components/Toast';
import { IconGripVertical } from '@tabler/icons';
import { position as caretPosition} from 'caret-pos';
import { useSelector, useDispatch } from 'react-redux';
import { getCaretPos } from 'utils/textarea';
import { slugify } from 'utils/text';
import { pageTitleChanged } from 'providers/Store/slices/kgraph';
import PageOptionDropdown from '../../PageOptionDropdown';
import RenderedTitle from './RenderedTitle';
import StyledWrapper from './StyledWrapper';

const Title = ({page, pageUid, caller}) => {
  const dispatch = useDispatch();
  const titleRef = useRef();
  const [editing, setEditing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const [isPageOptionsOpen, setPageOptionsOpen] = useState(false);
  const [pageOptionPosition, setPageOptionPosition] = useState('left');
  const [showToast, setShowToast] = useState({show: false});
  const kgraph = useSelector((state) => state.kgraph.kgraph);

  const {
    pageSlugMap
  } = kgraph;

  // Focus the block
  useEffect(() => {
    if(titleRef && titleRef.current) {
      if(cursorPosition) {
        caretPosition(titleRef.current, cursorPosition);
      }
      titleRef.current.focus();
    }
  }, [editing]);

  const stopEventPropogation = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
    if(event.nativeEvent && event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
  };

  const isDuplicateTitle = (newTitle) => {
    const slug = slugify(newTitle);

    if(slug === page.slug) {
      return false;
    }

    const pageUid = pageSlugMap.get(slug);
    if(pageUid && pageUid !== page.uid) {
      setShowToast({
        show: true,
        type: 'error',
        duration: 3000,
        text: 'Page already exists'
      });
      titleRef.current.value = page.title;
      return true;
    }

    return false;
  };

  const hasTitleChanged = (event) => {
    const slug = slugify(event.target.value);
    if(slug === page.slug) {
      return false;
    }

    return true;
  };

  const handleCloseToast = () => setShowToast({show: false});

  const handleTitleBlur = (event) => {
    setEditing(false);
    stopEventPropogation(event);
    if(!hasTitleChanged(event)) {
      return;
    }
    if(isDuplicateTitle(event.target.value)) {
      return;
    }

    // return dispatch({
    //   type: actions.PAGE_TITLE_CHANGED,
    //   noteUid: noteUid,
    //   title: event.target.value
    // });
  };

  const handleTitleClick = (event) => {
    stopEventPropogation(event);
    // dispatch({
    //   type: actions.PAGE_TITLE_TAB_CLICKED,
    //   noteUid: noteUid
    // });
  };

  const handleTitleKeyDown = (event) => {
    if(['s', 'S'].includes(event.key) && (event.ctrlKey || event.metaKey)) {
      stopEventPropogation(event);
      if(!hasTitleChanged(event)) {
        return;
      }
      if(isDuplicateTitle(event.target.value)) {
        return;
      }

      // return dispatch({
      //   type: actions.PAGE_TITLE_CHANGED,
      //   noteUid: noteUid,
      //   title: event.target.value,
      //   triggerSaveTransaction: true
      // });
    }

    if(['Tab', 'ArrowDown'].includes(event.key)) {
      stopEventPropogation(event);
      if(!hasTitleChanged(event)) {
        // return dispatch({
        //   type: actions.FOCUS_FIRST_LINE_OF_PAGE,
        //   noteUid: noteUid
        // });
      }
      if(isDuplicateTitle(event.target.value)) {
        return;
      }

      // return dispatch({
      //   type: actions.PAGE_TITLE_CHANGED,
      //   noteUid: noteUid,
      //   title: event.target.value
      // });
    }

    if(event.key === 'Enter') {
      stopEventPropogation(event);
      if(!hasTitleChanged(event)) {
        // return dispatch({
        //   type: actions.FOCUS_FIRST_LINE_OF_PAGE,
        //   noteUid: noteUid
        // });
      }
      if(isDuplicateTitle(event.target.value)) {
        return;
      }

      console.log('here');

      return dispatch(pageTitleChanged({
        pageUid: pageUid,
        title: event.target.value
      }));
    }
  };

  const handlePageOptionClick = (e) => {
    setPageOptionsOpen(true);
    setPageOptionPosition('right');
    // Todo: Fix this
    // setPageOptionPosition(e.pageX > 150 ? 'left' : 'right');
  };

  const editTitle = () => {
    let caretPos = getCaretPos(event);
    setCursorPosition(caretPos);
    setEditing(true);
  };

  const pageSlug = slugify(page.title);

  return (
    <StyledWrapper>
      {showToast.show && <Toast text={showToast.text} type={showToast.type}  duration={showToast.duration} handleClose={handleCloseToast}/>}
      <div className={`flex mb-5 items-center relative notebase-page-title`}>
        <div className="menu-icon">
          <IconGripVertical size={24} strokeWidth={2} onClick={handlePageOptionClick}/>
        </div>
        <PageOptionDropdown
          page={page}
          position={pageOptionPosition}
          isOpen={isPageOptionsOpen}
          onClose={() => setPageOptionsOpen(false)}
        />
        {editing && pageSlug !== 'index' ? (
          <input
            ref={titleRef}
            className="title w-full mousetrap"
            placeholder="Title"
            defaultValue={page.title}
            onClick={handleTitleClick}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleBlur}
          />
        ) : <RenderedTitle page={page} caller={caller} title={page.title} onEdit={editTitle}/> }
      </div>

      {/* {selectedNotebase && selectedNotebase.id && pageSlug === 'index' && (
        <div className="pt-2 pb-4 notebase-description">
          {selectedNotebase.description}
        </div>
      )} */}
    </StyledWrapper>
  );
};

Title.propTypes = {
  page: PropTypes.object.isRequired,
  pageUid: PropTypes.string.isRequired
};

export default Title;
