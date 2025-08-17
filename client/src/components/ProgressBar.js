"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProgressBar;
var jsx_runtime_1 = require("react/jsx-runtime");
function ProgressBar(_a) {
    var percentage = _a.percentage, _b = _a.showText, showText = _b === void 0 ? true : _b;
    var getColor = function (percent) {
        if (percent >= 90)
            return 'bg-green-500';
        if (percent >= 50)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    var getTextColor = function (percent) {
        if (percent >= 90)
            return 'text-green-600';
        if (percent >= 50)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 bg-gray-200 rounded-full h-2 mr-3", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(getColor(percentage)), style: { width: "".concat(Math.min(percentage, 100), "%") } }) }), showText && ((0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium ".concat(getTextColor(percentage)), children: [percentage, "%"] }))] }));
}
