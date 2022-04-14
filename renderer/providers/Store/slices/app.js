import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  idbConnectionReady: false,
  leftSidebarWidth: 222,
  screenWidth: 500
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    idbConnectionReady: (state) => {
      state.idbConnectionReady = true;
    },
    refreshScreenWidth: (state) => {
      state.screenWidth = window.innerWidth;
    },
    updateLeftSidebarWidth: (state, action) => {
      state.leftSidebarWidth = action.payload.leftSidebarWidth;
    }
  }
});

export const {
  idbConnectionReady,
  refreshScreenWidth,
  updateLeftSidebarWidth
} = appSlice.actions;

export default appSlice.reducer;
