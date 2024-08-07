import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import App from "./app/App";
import store from "./app/providers/StoreProvider/config/StoreProvider.js";
import "react-toastify/dist/ReactToastify.css";
import { setPinnedCards } from "./app/providers/StoreProvider/pinnedCardsSlice";

const storedPinnedCards = JSON.parse(localStorage.getItem("pinnedCards")) || {};
store.dispatch(setPinnedCards(storedPinnedCards));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);
