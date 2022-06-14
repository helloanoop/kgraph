import HotkeysProvider from 'providers/Hotkeys';
import AppProvider from 'providers/App';
import ThemeProvider from 'providers/Theme';
import Store from 'providers/Store';
import { enableMapSet } from 'immer';
import { Provider } from 'react-redux';

import '../styles/globals.css'
import 'tailwindcss/dist/tailwind.min.css';
import 'react-tabs/style/react-tabs.css';

import '../styles/app.scss';

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function NoSsr({ children }) {
  const SERVER_RENDERED = typeof navigator === 'undefined';

  if(SERVER_RENDERED) {
    return null;
  }

  return (
    <>
      {children}
    </>
  )
}

function MyApp({ Component, pageProps }) {
  enableMapSet();

  return (
    <SafeHydrate>
      <NoSsr>
        <Provider store={Store}>
          <ThemeProvider>
            <HotkeysProvider>
              <AppProvider>
                <Component {...pageProps} />
              </AppProvider>
            </HotkeysProvider>
          </ThemeProvider>
        </Provider>
      </NoSsr>
    </SafeHydrate>
  );
}

export default MyApp
