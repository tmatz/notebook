import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import markdownSlice from "./modules/markdown";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    markdown: markdownSlice.reducer,
  },
  middleware: (getDefaultMiddlewares) => [
    ...getDefaultMiddlewares({}),
    epicMiddleware,
  ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
