import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import useKgraphSync from './useKgraphSync';

export const AppContext = React.createContext();

export const AppProvider = props => {
  useKgraphSync();

  const routeToNewlyAddedPageUid = useSelector((state) => state.kgraph.routeToNewlyAddedPageUid);
  const router = useRouter();
  useEffect(() => {
    if(routeToNewlyAddedPageUid) {
      router.push(routeToNewlyAddedPageUid);
    }
  }, [routeToNewlyAddedPageUid]);

  return (
    <AppContext.Provider {...props} value='appProvider'>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
