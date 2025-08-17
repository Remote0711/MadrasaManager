"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
var jsx_runtime_1 = require("react/jsx-runtime");
var Navigation_1 = require("./Navigation");
function Layout(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0, jsx_runtime_1.jsx)(Navigation_1.default, {}), (0, jsx_runtime_1.jsx)("main", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: children })] }));
}
