import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { IServiceApi } from "~/api/service-api";
import gitlabSlice from "./modules/gitlab";
import markdownSlice from "./modules/markdown";

export function createStore(extraArgument: { serviceApi: IServiceApi }) {
  const epicMiddleware = createEpicMiddleware();

  return configureStore({
    reducer: {
      gitlab: gitlabSlice.reducer,
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
