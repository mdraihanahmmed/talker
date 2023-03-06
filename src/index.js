import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebaseConfig from "./firbaseConfig";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./pages/home";
import Registraiton from "./pages/registration";
import Login from "./pages/login";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/forgotpassword";
import store from "./store";
import { Provider } from "react-redux";
import Message from "./pages/message/Message";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/registration",
    element: <Registraiton />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/message",
    element: <Message />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
