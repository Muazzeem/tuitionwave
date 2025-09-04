import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

ReactDOM.hydrateRoot(document.getElementById("root"), 
<BrowserRouter>
  <App />
</BrowserRouter>
);

