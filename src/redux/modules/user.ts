import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "~/redux/modules";

export const boot = createAsyncThunk<User | undefined>(
  "user/boot",
  async (_, { extra: { serviceApi } }) => {
    return await serviceApi.boot();
  }
);

export const login = createAsyncThunk<boolean, string>(
  "user/login",
  async (serviceName, { extra: { serviceApi } }) => {
    serviceApi.setCurrent(serviceName);
    return await serviceApi.login();
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  (_, { extra: { serviceApi } }) => {
    serviceApi.logout();
  }
);

type State = {
  serviceName: string | undefined;
  isLoggedIn: boolean;
  isPending: boolean;
  user: User | undefined;
};

type User = {
  name: string;
  username: string;
};

const initialState: State = {
  serviceName: undefined,
  isLoggedIn: false,
  isPending: false,
  user: undefined,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(boot.pending, (state) => {
        state.isPending = true;
      })
      .addCase(boot.fulfilled, (state, { payload: user }) => {
        state.isLoggedIn = true;
        state.isPending = false;
        state.user = user;
      })
      .addCase(boot.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
        state.user = undefined;
      })
      .addCase(login.pending, (state, { meta: { arg: serviceName } }) => {
        state.serviceName = serviceName;
        state.isPending = true;
      })
      .addCase(login.fulfilled, (state, { payload: success }) => {
        if (success) {
          state.isLoggedIn = true;
          state.isPending = false;
        }
      })
      .addCase(login.rejected, (state) => {
        state.serviceName = undefined;
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.serviceName = undefined;
        state.isLoggedIn = false;
        state.isPending = false;
        state.user = undefined;
      });
  },
});

export default slice;
