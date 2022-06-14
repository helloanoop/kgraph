import React, { useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import lightTheme from 'themes/light';

export const ThemeContext = React.createContext();

export const ThemeProvider = props => {
  const [currentTheme, setCurrentTheme] = useState('light');

  const value = {
    currentTheme,
    setCurrentTheme
  };
  const theme = lightTheme;

  return (
    <ThemeContext.Provider value={value}>
      <SCThemeProvider theme={theme} {...props}/>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(`useTheme must be used within a ThemeProvider`);
  }

  return context;
};

export default ThemeProvider;
