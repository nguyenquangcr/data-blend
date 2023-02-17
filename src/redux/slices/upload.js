const { createSlice } = require('@reduxjs/toolkit');

const slice = createSlice({
  name: 'upload',
  initialState: {
    preview: []
  },
  reducers: {
    actionSetPreview(state, { payload }) {
      state.preview = payload;
    }
  }
});

export default slice.reducer;

export const { actionSetPreview } = slice.actions;
