"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherAttendance;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var TeacherLayout_1 = require("@/components/TeacherLayout");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
var AttendanceTracker_1 = require("@/components/AttendanceTracker");
function TeacherAttendance() {
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['/api/teacher/students'],
    }), students = _a.data, isLoading = _a.isLoading;
    var getCurrentWeek = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[#005C5C]", children: tr_1.tr.attendance }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["\u00D6\u011Frenci devam durumunu i\u015Faretleyin - Hafta ", getCurrentWeek()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-[#005C5C]" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: new Date().toLocaleDateString('tr-TR') })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-[#E5E5E5]", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-[#FAF8F4]", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center text-[#005C5C]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mr-2 h-5 w-5" }), "Devam Durumu - Hafta ", getCurrentWeek()] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsx)(AttendanceTracker_1.default, { students: students || [] }) })] })] }) }));
}
