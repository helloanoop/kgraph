import React from 'react';
import useKgraphSync from './useKgraphSync';

export const AppContext = React.createContext();

export const AppProvider = props => {
  useKgraphSync();

  return (
    <AppContext.Provider {...props} value='appProvider'>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
