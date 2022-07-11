import React, { useState, useMemo, useRef} from 'react';
import filter from 'lodash/filter';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { matchSorter } from "match-sorter";
import { slugify } from 'utils/text';
import SearchModal from './SearchModal';
import SearchIcon from './SearchIcon';
import StyledWrapper from './StyledWrapper';

const SearchKgraph = ({
  onClose,
  onSelect
}) => {
  const kgraph = useSelector((state) => state.kgraph.kgraph);
  const {
    pageMap,
    pageSlugMap
  } = kgraph;

  const windowWidth = window.innerWidth;
  const isSmall = windowWidth < 500;
  const isMedium = windowWidth < 800;
  let size = '';

  if(isSmall) {
    size = "sm";
  } else if (isMedium) {
    size = "md";
  } else {
    size = "lg";
  }

  const pageTitles = useMemo(() => {
    return [...pageMap].map((entry) => {
      let page = entry[1];

      return {
        uid: page.uid,
        title: page.title
      };
    });
  }, [pageMap]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const search = (searchKey) => {
    if(!searchKey || !searchKey.length || typeof searchKey !== 'string') {
      return;
    }

    let slug = slugify(searchKey);
    let slugMatch = pageSlugMap.get(slug);
    let matchedResults = matchSorter(pageTitles, searchKey, { keys: ["title"] });

    // if there is a slug match, title should always be in the beginning
    if(slugMatch) {
      let matchedNote = pageMap.get(slugMatch);
      matchedResults = filter(matchedResults, (r) => r.uid !== matchedNote.uid);
      matchedResults.unshift({
        uid: matchedNote.uid,
        title: matchedNote.title
      })
    } else {
      matchedResults.unshift({
        uid: null,
        title: searchKey
      });
    }

    setSearchResult(matchedResults || []);
  };

  const debouncedSearch = useRef(debounce(val => search(val), 50)).current;

  const handleInputChange = (e) => {
    let query = e.target.value;
    setSearchQuery(query);

    if(query && query.length) {
      debouncedSearch(query);
    }
  };

  const HighlightedText = (data) => {
    const parts = data.text.split(new RegExp(`(${data.highlight})`, 'gi'));
    const highlightStyle = {
      color: 'rgb(47, 48, 55)',
      paddingTop: '3px',
      paddingBottom: '3px',
    };

    return (
      <span> { parts.map((part, i) => 
        <span key={i} style={part.toLowerCase() === data.highlight.toLowerCase() ? highlightStyle : {} }>
            { part }
        </span>)
      } </span>
    ) 
  }

  const resetQuery = () => {
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <StyledWrapper>
      <SearchModal handleClose = {handleClose} size={size}>
        <div>
          <Downshift
            defaultHighlightedIndex={0}
            onChange={selected => onSelect(selected)}
            itemToString={(item) => {if (item) {return item.title} }}
          >
            {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
              <div className="border-b border-gray-600">
                <div className="flex items-center px-4 p-3 searchbox-container">
                  <span className="search-icon">
                    <SearchIcon className="search-icon" color="silver"/>
                  </span>
                  <input autoFocus
                    {...getInputProps()}
                    className="search-notebase"
                    type="text"
                    placeholder="Find or Create Page"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && highlightedIndex === 0) {
                        onSelect(searchResult[0])
                        return;
                      }
                      let inputProps = getInputProps();
                      inputProps.onKeyDown(e);
                    }}
                    value={searchQuery}
                  />
                  {searchQuery && searchQuery.length && (
                    <div className="justify-end cursor-pointer">
                      <span className="close-icon" onClick={resetQuery}>×</span>
                    </div>
                  )}
                </div>
                <div>
                  {(
                    <div className="downshift-dropdown">
                      {searchResult.map((page, index) => (
                        <div
                          className={`dropdown-item cursor-pointer ${highlightedIndex === index ? 'selected' : ''}`}
                          {...getItemProps({
                            index,
                            key: page.uid,
                            item: page
                          })}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();

                            // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
                            if(event.nativeEvent) {
                              event.nativeEvent.stopImmediatePropagation();
                            }
                            onSelect(page);
                          }}
                        >
                          {page.uid ? (
                            <HighlightedText text={page.title} highlight={searchQuery}/>
                          ) : (
                            <div className="new-page">
                              <span className="font-semibold new-page-label">New Page: </span>{page.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Downshift>
        </div>
      </SearchModal>
    </StyledWrapper>
  )
};

export default SearchKgraph;
