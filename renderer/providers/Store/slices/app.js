import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  leftSidebarWidth: 222
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateLeftSidebarWidth: (state, action) => {
      state.leftSidebarWidth = action.payload.leftSidebarWidth;
    }
  }
});

export const {
  updateLeftSidebarWidth
} = appSlice.actions;

export default appSlice.reducer;
