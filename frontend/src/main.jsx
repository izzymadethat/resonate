import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import configureStore from "./store/store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import { Modal, ModalProvider } from "./context/Modal";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <div className="size-full">
          <App />
        </div>
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
