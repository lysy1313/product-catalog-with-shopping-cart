import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router";
import App from "./app/App.tsx";
import { applyThemeMode, initialThemeMode } from "./app/model/app-slice.ts";
import "./index.css";
import { store } from "./app/providers/store/store.ts";

applyThemeMode(initialThemeMode);

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
);
