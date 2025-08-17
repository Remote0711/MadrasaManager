"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
var jsx_runtime_1 = require("react/jsx-runtime");
var wouter_1 = require("wouter");
function ProtectedRoute(_a) {
    var children = _a.children, allowedRoles = _a.allowedRoles, user = _a.user;
    if (!user) {
        return (0, jsx_runtime_1.jsx)(wouter_1.Redirect, { to: "/login" });
    }
    if (!allowedRoles.includes(user.role)) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Yetkisiz Eri\u015Fim" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Bu sayfaya eri\u015Fim yetkiniz bulunmuyor." })] }) }));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
