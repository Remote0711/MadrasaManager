"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var client_1 = require("react-dom/client");
function App() { return (0, jsx_runtime_1.jsx)("div", { children: "Client ready" }); }
var root = (0, client_1.createRoot)(document.getElementById('root'));
root.render((0, jsx_runtime_1.jsx)(App, {}));
