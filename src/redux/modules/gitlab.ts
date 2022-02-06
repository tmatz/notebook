import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "~/redux/modules";

export const boot = createAsyncThunk<User>(
  "boot",
  async (_, { extra: { gitlabApi } }) => {
    return await gitlabApi.boot();
  }
);

export const tryLogin = createAsyncThunk<void>(
  "oauth",
  async (_, { extra: { gitlabApi } }) => {
    await gitlabApi.login();
  }
);

export const checkLogin = createAsyncThunk<User>(
  "checkAuthorized",
  async (_, { extra: { gitlabApi } }) => {
    return await gitlabApi.checkLogin();
  }
);

export const logout = createAsyncThunk(
  "logout",
  (_, { extra: { gitlabApi } }) => {
    gitlabApi.logout();
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
