import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "~/redux/modules";

export const boot = createAsyncThunk<User | undefined>(
  "user/boot",
  async (_, { extra: { serviceApi } }) => {
    return await serviceApi.boot();
  }
);

export const login = createAsyncThunk<boolean>(
  "user/oauth",
  async (_, { extra: { serviceApi } }) => {
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
      .addCase(login.pending, (state) => {
        state.isPending = true;
      })
      .addCase(login.fulfilled, (state, { payload: success }) => {
        if (success) {
          state.isLoggedIn = true;
          state.isPending = false;
        }
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isPending = true;
        state.user = undefined;
      });
  },
});

export default slice;
