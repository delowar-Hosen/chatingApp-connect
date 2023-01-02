import { createSlice } from "@reduxjs/toolkit";
export const chatActiveSlice = createSlice({
  name: "chatActive",
  initialState: {
    value: null,
  },
  reducers: {
    chatActive: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { chatActive } = chatActiveSlice.actions;

export default chatActiveSlice.reducer;
