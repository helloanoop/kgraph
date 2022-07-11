import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Mousetrap from 'mousetrap';
import SearchKgraph from 'components/SearchKgraph';
import { safeTrim, isStringWithAtleastAChar} from 'utils/text';

export const HotkeysContext = React.createContext();

export const HotkeysProvider = props => {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);

  const searchKgraph = () => {
    if(!openSearch) {
      setOpenSearch(true);
    }
  };

  useEffect(() => {
    Mousetrap.bind(['command+k', 'ctrl+k', 'shift shift'], (e) => {
      if(!openSearch) {
        setOpenSearch(true);
      }

      return false; // this stops the event bubbling
    });

    return () => {
      Mousetrap.unbind(['command+k', 'ctrl+k', 'shift shift']);
      Mousetrap.unbind(['command+s', 'ctrl+s']);
    };
  }, []);

  const closeSearchModal = () => setOpenSearch(false);

  const handleSelect = (page) => {
    setOpenSearch(false);
    if(!page || !isStringWithAtleastAChar(page.title)) {
      return;
    }
    console.log(page);

    if(page.uid) {
      router.push(page.uid);
    } else {
      // dispatch({
      //   type: actions.NEW_PAGE,
      //   title: safeTrim(page.title)
      // });
    }
  };

  const value = {
    searchKgraph: searchKgraph
  };

  return (
    <HotkeysContext.Provider value={value} {...props}>
      {openSearch && (
        <SearchKgraph onClose={closeSearchModal} onSelect={handleSelect}/>
      )}
      {props.children}
    </HotkeysContext.Provider>
  );
};

export const useHotkeys = () =>  {
  const context = React.useContext(HotkeysContext);

  if (!context) {
    throw new Error(`useHotkeys must be used within a HotkeysProvider`);
  }

  return context;
}

export default HotkeysProvider;
