import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {matchSorter} from "match-sorter";
import StyledWrapper from './StyledWrapper';

const allowedCommands = [{
    id: "todo",
    label: "Todo"
  }, {
    id: "bold",
    label: "Bold"
  }, {
    id: "italic",
    label: "Italic"
  }, {
    id: "strikethrough",
    label: "Strikethrough"
  }, {
    id: "currenttime",
    label: "Current Time"
  }, {
    id: "today",
    label: "Today"
  }, {
    id: "tomorrow",
    label: "Tomorrow"
  }, {
    id: "yesterday",
    label: "Yesterday"
  }
];

const SlashCommands = ({searchKey, position, onClose}) => {
  const [commandList, setCommandList] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(0);

  useEffect(() => {
    if(searchKey && searchKey.length) {
      let list = matchSorter(allowedCommands, searchKey, { keys: ["label"] });
      setCommandList(list);
    } else {
      setCommandList([...allowedCommands]);
    }
  }, [searchKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const newSelectedCommand = selectedCommand === commandList.length - 1 ? 0 : selectedCommand + 1;
        setSelectedCommand(newSelectedCommand);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newSelectedCommand = selectedCommand === 0 ? commandList.length - 1 : selectedCommand - 1;
        setSelectedCommand(newSelectedCommand);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onClose(commandList[selectedCommand]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [commandList, selectedCommand]);

  const handleCommandSelect = () => {
    onClose(commandList[selectedCommand]);
  };

  if(!commandList || !commandList.length) {
    return null;
  }

  return (
    <StyledWrapper>
      <div
        className="popover"
        style={{
          left: position.left + 30,
          top: position.top + 22
        }}
      >
        {commandList.map((command, key) => {
          return (
            <div
              key={key}
              className={
                commandList.indexOf(command) === selectedCommand
                  ? 'slash-command-item selected'
                  : 'slash-command-item'
              }
              role="button"
              tabIndex="0"
              onClick={() => handleCommandSelect(command)}
            >
              {command.label}
            </div>
          );
        })}
      </div>
    </StyledWrapper>
  );
}

SlashCommands.propTypes = {
  searchKey: PropTypes.string.isRequired, 
  position: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SlashCommands;
