import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "~/redux/modules";

export const tryLogin = createAsyncThunk<string>(
  "oauth",
  async (_, { extra: { gitlabApi } }) => {
    return await gitlabApi.getOAuthURL();
  }
);

export const checkLogin = createAsyncThunk<
  void,
  { code: string | null; state: string | null }
>("checkAuthorized", async (args, { extra: { gitlabApi } }) => {
  try {
    const { code, state } = args;
    await gitlabApi.checkOAuthCode({ code, state });
    const json = await gitlabApi.requestOAuthAccessToken(code!);
    await gitlabApi.checkAndStoreOAuthAccessToken(json);
  } catch {
    gitlabApi.resetOAuth();
    return Promise.reject("wrong response");
  }
});

export const logout = createAsyncThunk(
  "logout",
  (_, { extra: { gitlabApi } }) => {
    gitlabApi.resetOAuth();
  }
);

type State = {
  isLoggedIn: boolean;
  isPending: boolean;
};

const initialState: State = {
  isLoggedIn: false,
  isPending: false,
};

const slice = createSlice({
  name: "gitlab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tryLogin.pending, (state) => {
        state.isPending = true;
      })
      .addCase(tryLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(checkLogin.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.isPending = false;
      })
      .addCase(checkLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isPending = true;
      });
  },
});

export default slice;
