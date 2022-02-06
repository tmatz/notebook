import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "~/redux/modules";

export const boot = createAsyncThunk<User | undefined>(
  "boot",
  async (_, { extra: { serviceApi } }) => {
    return await serviceApi.boot();
  }
);

export const tryLogin = createAsyncThunk<void>(
  "oauth",
  async (_, { extra: { serviceApi } }) => {
    await serviceApi.login();
  }
);

export const checkLogin = createAsyncThunk<User | undefined>(
  "checkAuthorized",
  async (_, { extra: { serviceApi } }) => {
    return await serviceApi.checkLogin();
  }
);

export const logout = createAsyncThunk(
  "logout",
  (_, { extra: { serviceApi } }) => {
    serviceApi.logout();
  }
);

type State = {
  isLoggedIn: boolean;
  isPending: boolean;
  user: User | undefined;
};

type User = {
  name: string;
  username: string;
};

const initialState: State = {
  isLoggedIn: false,
  isPending: false,
  user: undefined,
};

const slice = createSlice({
  name: "gitlab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(boot.pending, (state) => {
        state.isPending = true;
      })
      .addCase(boot.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.isPending = false;
        state.user = payload as User;
      })
      .addCase(boot.rejected, (state) => {
        state.isPending = false;
      })
      .addCase(tryLogin.pending, (state) => {
        state.isPending = true;
      })
      .addCase(tryLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(checkLogin.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.isPending = false;
        state.user = payload as User;
      })
      .addCase(checkLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
        state.user = undefined;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isPending = true;
        state.user = undefined;
      });
  },
});

export default slice;
