import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const oauth = createAsyncThunk("oauth", () => {});

const slice = createSlice({
  name: "gitlab",
  initialState: {},
  reducers: {},
});

export default slice;
