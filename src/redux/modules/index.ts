import {
  AsyncThunk,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk as rawCreateAsyncThunk,
  Dispatch,
} from "@reduxjs/toolkit";
import type { AppDispatch, ExtraArgument, RootState } from "../store";

function withThunkApiConfig<S, E, D extends Dispatch>() {
  type ThunkApiConfig = {
    state: S;
    extra: E;
    dispatch: D;
  };
  return {
    createAsyncThunk<Returned, ThunkArg = void>(
      typePrefix: string,
      payloadCreator: AsyncThunkPayloadCreator<
        Returned,
        ThunkArg,
        ThunkApiConfig
      >,
      options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
    ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> {
      return rawCreateAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
        typePrefix,
        payloadCreator,
        options
      );
    },
  };
}

export const { createAsyncThunk } = withThunkApiConfig<
  RootState,
  ExtraArgument,
  AppDispatch
>();
