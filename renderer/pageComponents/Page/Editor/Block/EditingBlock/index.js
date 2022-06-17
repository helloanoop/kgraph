import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { position as caretPosition} from 'caret-pos';
import SlashCommands from '../SlashCommands';
import SearchResults from '../SearchResults';
import last from 'lodash/last';
import { toggleCheckbox } from '../utils';
import { useDispatch } from 'react-redux';
import { onSlashCommandSelect } from './onSlashCommandSelect';
import {
  onBlockBlur,
  blockEnterKeyPressed,
  blockTabKeyPressed,
  blockUpKeyPressed,
  blockDownKeyPressed,
  blockBackspaceKeyPressed
} from 'providers/Store/slices/kgraph';

// Todo: Check if passing focusedBlock in props is causing performance issues

const EditingBlock = ({ block, focusedBlock, pageUid }) => {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const [slashCommands, setSlashCommands] = useState({
    show: false,
    position: {},
    searchKey: ''
  });
  const [searchResults, setSearchResults] = useState({
    show: false,
    position: {},
    searchKey: ''
  });

  // Focus the block
  useEffect(() => {
    if(textareaRef && textareaRef.current) {
      if(focusedBlock && focusedBlock.caretPos) {
        caretPosition(textareaRef.current, focusedBlock.caretPos);
      }
      textareaRef.current.focus();
    }
  }, []);

  const stopEventPropogation = (event) => {
    event.stopPropagation();

    // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
    event.nativeEvent.stopImmediatePropagation();
  };

  const _handleKeyDown = (event) => {
    // Prevents React from resetting its properties:
    // Need to remove this after migrating to react 17
    // https://reactjs.org/docs/legacy-event-pooling.html
    event.persist();

    // stop event bubbling when shift enter key is pressed
    if(event.shiftKey && event.key === 'Enter') {
      stopEventPropogation(event);
      return;
    }

    if(
      (event.ctrlKey && event.key === 'Control') ||
      (event.ctrlKey && event.key === 's') ||
      (event.ctrlKey && event.key === 'S') ||
      (event.shiftKey && event.key === 'Shift') ||
      (event.key === 'Alt')
    ) {
      stopEventPropogation(event);
      return;
    }

    if(event.key === '/') {
      const position = caretPosition(textareaRef.current);
      setSlashCommands({
        show: true,
        position: position,
        searchKey: ''
      });
      return;
    }

    if(slashCommands.show) {
      const caretPos = event.target.selectionStart;
      const value = event.target.value.substring(0, caretPos);
      const parts = value.split('/');

      if (parts && parts.length) {
        const searchKey = last(parts);
        setSlashCommands({
          ...slashCommands,
          searchKey: searchKey
        });
      }
    }

    if((slashCommands.show || searchResults.show) && ['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
      return;
    }

    // when user presses down key
    // stop event bubbling the user has not reached eol in a multiline textarea
    if(event.key === 'ArrowDown') {
      const position = caretPosition(textareaRef.current);

      // Get the computed styles for the element
      const computed = window.getComputedStyle(event.target);
      const lineHeight = parseInt(computed.getPropertyValue('line-height'), 10);
      const textareaHeight = parseInt(computed.getPropertyValue('height'), 10);

      // 5 is the padding
      const cursorPositionFromTop = position.top + lineHeight + 5;

      // check if cursor is at end of line
      // 10 is a decent error buffer since line height us usually aroud 20px
      if(Math.abs(cursorPositionFromTop - textareaHeight) > 10) {
        stopEventPropogation(event);
        return;
      }
    }

    // when user presses up key
    // stop event bubbling the user has not reached the beginning line in a multiline textarea
    if(event.key === 'ArrowUp') {
      const position = caretPosition(textareaRef.current);

      // check if cursor is at beginning of line
      // 10 is a decent error buffer since line height us usually aroud 20px
      if(position.top > 10) {
        stopEventPropogation(event);
        return;
      }
    }

    const dispatchEvent = (dispatcher, preventDefault = true) => {
      if(preventDefault) {
        event.preventDefault();
      }

      return dispatch(dispatcher({
        block: block,
        event: event,
        pageUid: pageUid,
        caretPosition: caretPosition(textareaRef.current).pos
      }));
    };

    if(event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      const caretPos = event.target.selectionStart;
      const value = event.target.value;
      const toggleResults = toggleCheckbox(value);
      event.target.value = toggleResults.content;

      let newCaretPos = caretPos;
      if(toggleResults.transition == 'nothing->checked') {
        newCaretPos += 4;
      } else if (toggleResults.transition == 'checked->nothing') {
        newCaretPos -= 4;
      }
      event.target.selectionStart = newCaretPos;
      event.target.selectionEnd = newCaretPos;

      return;
    }

    if(event.key === 'Enter') {
      return dispatchEvent(blockEnterKeyPressed);
    }

    if(event.key === 'Tab') {
      return dispatchEvent(blockTabKeyPressed);
    }

    if(event.key === 'ArrowUp') {
      return dispatchEvent(blockUpKeyPressed);
    }

    if(event.key === 'ArrowDown') {
      return dispatchEvent(blockDownKeyPressed);
    }

    if(event.key === 'Backspace') {
      if (textareaRef.current.selectionStart !== 0) {
        return;
      }
      if (block.hasChildren()) {
        return;
      }
      return dispatchEvent(blockBackspaceKeyPressed);
    }

    if(event.key === '[') {
      event.preventDefault()
      const selectionStart = event.target.selectionStart;
      const selectionEnd = event.target.selectionEnd;

      const caretPos = event.target.selectionStart;
      const value = event.target.value;
      const prevChar = value.charAt(caretPos - 1);

      if(selectionStart === selectionEnd) {
        event.target.value = value.substring(0, caretPos) + '[]' + value.substring(caretPos, value.length);
        event.target.selectionStart = caretPos + 1;
        event.target.selectionEnd = caretPos + 1;
      } else {
        event.target.value = value.substring(0, selectionStart) + '['
                             + value.substring(selectionStart, selectionEnd) + ']'
                             + value.substring(selectionEnd, value.length);
        event.target.selectionStart = selectionStart + 1;
        event.target.selectionEnd = selectionEnd + 1;
      }

      const position = caretPosition(textareaRef.current);
      if(prevChar === '[' && !searchResults.show) {
        setSearchResults({
          show: true,
          position: position,
          searchKey: ''
        });
      }
    }

    if(searchResults.show) {
      const caretPos = event.target.selectionStart;
      const value = event.target.value.substring(0, caretPos);
      const parts = value.split('[[');

      if (parts && parts.length) {
        const searchKey = last(parts);
        setSearchResults({
          ...searchResults,
          searchKey: searchKey
        });
      }
    }
  };

  const onSlashCommandsClose = (selectedCommand) => {
    setSlashCommands({
      show: false,
      position: {}
    });

    if(selectedCommand) {
      onSlashCommandSelect(selectedCommand, textareaRef);
    }
  };

  const onSearchResultsClose = (selectedNote) => {
    setSearchResults({
      show: false,
      position: {},
      searchKey: ''
    });

    if(selectedNote) {
      const textareaCaretPos = caretPosition(textareaRef.current);
      const caretPos = textareaCaretPos.pos;
      const value = textareaRef.current.value;
      const firstPart = value.substring(0, caretPos);
      const lastIndex = firstPart.lastIndexOf('[[');
      const firstPartCleaned = firstPart.substring(0, lastIndex);
      const firstPartWithSelectedNote = `${firstPartCleaned}[[${selectedNote.title}]]`;
      const secondPart = value.substring(caretPos +2, value.length);
      let newCaretPos = firstPartWithSelectedNote.length + 1;
      
      if(secondPart && secondPart.length) {
        let firstChar = secondPart[0];
        if(firstChar === ' ') {
          textareaRef.current.value = `${firstPartWithSelectedNote}${secondPart}`;
        } else {
          textareaRef.current.value = `${firstPartWithSelectedNote} ${secondPart}`;
        }
      } else {
        textareaRef.current.value = `${firstPartWithSelectedNote} `;
      }

      textareaRef.current.selectionStart = newCaretPos;
      textareaRef.current.selectionEnd = newCaretPos;
    } else {
      let currentCaretPos = textareaRef.current.selectionStart;
      let value = textareaRef.current.value;
      let beforeCaretPos = value.substring(0, currentCaretPos + 2);
      let afterCaretPos = value.substring(currentCaretPos + 2, value.length);

      if(afterCaretPos && afterCaretPos.length) {
        let firstChar = afterCaretPos[0];
        if(firstChar !== ' ') {
          textareaRef.current.value = `${beforeCaretPos} ${afterCaretPos}`;
        }
      } else {
        textareaRef.current.value = `${textareaRef.current.value} `;
      }
      textareaRef.current.selectionStart = currentCaretPos + 3;
      textareaRef.current.selectionEnd = currentCaretPos + 3;
    }
  };

  const onBlur = () => {
    return dispatch(onBlockBlur({
      block: block,
      content: textareaRef.current.value,
      pageUid: pageUid
    }));
  };

  return (
    <>
      <TextareaAutosize
        className="notebase-block-content-editing mousetrap"
        defaultValue={block.content}
        ref={textareaRef}
        autoCapitalize="none"
        rows="1"
        onChange={_handleKeyDown}
        onKeyDown={_handleKeyDown}
        onBlur={onBlur}
      />
      {slashCommands.show && (
        <SlashCommands
          position={slashCommands.position}
          onClose={onSlashCommandsClose}
          searchKey={slashCommands.searchKey}
        >
        </SlashCommands>
      )}
      {searchResults.show && (
        <SearchResults
          searchKey={searchResults.searchKey}
          position={searchResults.position}
          onClose={onSearchResultsClose}
        >
        </SearchResults>
      )}
    </>
  );
};

export default EditingBlock;
