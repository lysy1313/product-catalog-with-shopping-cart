import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { store } from "./app/store.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
