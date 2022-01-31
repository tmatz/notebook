import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  content: string;
};

const block = "```";

const markdown = `# markdown sample

a<br/>b

${block}javascript
const a = b + c + d;
${block}
`;

const initialState: State = {
  content: markdown,
};

const slice = createSlice({
  name: "markdown",
  initialState,
  reducers: {
    update(state, { payload }: PayloadAction<string>) {
      state.content = payload;
    },
    reset(state) {
      state.content = "";
    },
  },
});

export const { update, reset } = slice.actions;

export default slice;
