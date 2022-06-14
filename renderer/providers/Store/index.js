import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import kgraphReducer from './slices/kgraph';

export const store = configureStore({
  reducer: {
    app: appReducer,
    kgraph: kgraphReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

export default store;
