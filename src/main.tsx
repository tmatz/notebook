import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CompositeServiceApi } from "~/api/composite-service-api";
import { FileApi } from "~/api/file-api";
import { GitlabApi } from "~/api/gitlab-api";
import App from "~/components/App";
import { createStore } from "~/redux/store";
import "./index.css";

const serviceApi = new CompositeServiceApi([new GitlabApi(), new FileApi()]);

const basename = import.meta.env.BASE_URL;

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#282c34",
        color: "gray.500",
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore({ serviceApi })}>
      <ChakraProvider theme={theme}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
