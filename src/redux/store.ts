import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { CompositeServiceApi } from "~/api/composite-service-api";
import markdownSlice from "./modules/markdown";
import userSlice from "./modules/user";

export function createStore(extraArgument: {
  serviceApi: CompositeServiceApi;
}) {
  const epicMiddleware = createEpicMiddleware();

  return configureStore({
    reducer: {
      user: userSlice.reducer,
      markdown: markdownSlice.reducer,
    },
    middleware: (getDefaultMiddlewares) =>
      [
        ...getDefaultMiddlewares({
          thunk: {
            extraArgument,
          },
        }),
        epicMiddleware,
      ] as const,
  });
}

type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type ExtraArgument = Parameters<typeof createStore>[0];
