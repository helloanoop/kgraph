import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { matchSorter } from "match-sorter";
import StyledWrapper from './StyledWrapper';

const SearchResults = ({position, searchKey, onClose}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const kgraph = useSelector((state) => state.kgraph.kgraph);

  const {
    pageMap
  } = kgraph;

  const noteTitles = useMemo(() => {
    return [...pageMap].map((entry) => {
      let page = entry[1];

      return {
        uid: page.uid,
        title: page.title
      };
    });
  }, [pageMap]);

  // Filter based on given searchKey
  useEffect(() => {
    let options = matchSorter(noteTitles, searchKey, { keys: ["title"] });
    options = options || [];
    setOptions(options.slice(0, 10));
  }, [noteTitles, searchKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedOption(selectedOption === options.length - 1 ? 0 : selectedOption + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedOption(selectedOption === 0 ? options.length - 1 : selectedOption - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onClose(options[selectedOption]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [options, selectedOption]);

  const handleSelect = () => {
    onClose(options[selectedOption]);
  };

  return (
    <StyledWrapper>
      <div
        className="popover"
        style={{
          left: position.left + 10,
          top: position.top + 22
        }}
      >
        {searchKey && searchKey.length && options.length ? options.map((option, key) => {
          return (
            <div
              key={option.uid}
              className={
                options.indexOf(option) === selectedOption
                  ? 'item selected'
                  : 'item'
              }
              role="button"
              tabIndex="0"
              onClick={() => handleSelect(option)}
            >
              {option.title}
            </div>
          );
        }) : (
          <div
            className='item text-gray-500'
            role="button"
            tabIndex="0"
          >
            Search for a Page
          </div>
        )}
      </div>
    </StyledWrapper>
  );
}

SearchResults.propTypes = {
  searchKey: PropTypes.string.isRequired, 
  position: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SearchResults;
