import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "~/components/App";
import { createStore } from "~/redux/store";
import { GitlabApi } from "./api/GitlabApi";
import "./index.css";

const gitlabApi = new GitlabApi();

const basename = import.meta.env.BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore({ gitlabApi })}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
