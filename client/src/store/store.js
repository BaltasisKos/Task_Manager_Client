import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../store/taskSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
