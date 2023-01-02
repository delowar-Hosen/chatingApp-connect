import { configureStore } from "@reduxjs/toolkit";
import chatActiveSlice from "./slice/ActiveChat";

export default configureStore({
  reducer: {
    chatActive: chatActiveSlice,
  },
});
