"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParentAttendance;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var ParentLayout_1 = require("@/components/ParentLayout");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
function ParentAttendance() {
    var _a, _b, _c;
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['/api/parent/child'],
    }), child = _d.data, childLoading = _d.isLoading;
    var _e = (0, react_query_1.useQuery)({
        queryKey: ["/api/student/".concat(child === null || child === void 0 ? void 0 : child.id, "/attendance")],
        enabled: !!(child === null || child === void 0 ? void 0 : child.id),
    }), attendance = _e.data, attendanceLoading = _e.isLoading;
    if (childLoading || attendanceLoading) {
        return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    if (!child) {
        return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "\u00C7ocuk bilgisi bulunamad\u0131." }) }) }));
    }
    var getAttendanceIcon = function (status) {
        switch (status) {
            case 'present':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-green-600" });
            case 'absent':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 text-red-600" });
            case 'excused':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-gray-400" });
        }
    };
    var getAttendanceColor = function (status) {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'excused':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getAttendanceText = function (status) {
        switch (status) {
            case 'present':
                return tr_1.tr.present;
            case 'absent':
                return tr_1.tr.absent;
            case 'excused':
                return tr_1.tr.excused;
            default:
                return 'Belirsiz';
        }
    };
    // Calculate attendance statistics
    var totalWeeks = (attendance === null || attendance === void 0 ? void 0 : attendance.length) || 0;
    var presentCount = (attendance === null || attendance === void 0 ? void 0 : attendance.filter(function (a) { return a.status === 'present'; }).length) || 0;
    var absentCount = (attendance === null || attendance === void 0 ? void 0 : attendance.filter(function (a) { return a.status === 'absent'; }).length) || 0;
    var excusedCount = (attendance === null || attendance === void 0 ? void 0 : attendance.filter(function (a) { return a.status === 'excused'; }).length) || 0;
    var attendanceRate = totalWeeks > 0 ? Math.round((presentCount / totalWeeks) * 100) : 0;
    var getCurrentWeek = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    };
    return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: tr_1.tr.attendance }), (0, jsx_runtime_1.jsxs)("p", { className: "text-muted-foreground", children: [child.firstName, " ", child.lastName, " - ", (_a = child.class) === null || _a === void 0 ? void 0 : _a.name, " (", (_c = (_b = child.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name, ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-muted-foreground", children: ["Hafta ", getCurrentWeek()] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Devam Oran\u0131" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold ".concat(attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 70 ? 'text-yellow-600' : 'text-red-600'), children: ["%", attendanceRate] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-muted-foreground", children: [totalWeeks, " hafta i\u00E7inde"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Kat\u0131ld\u0131" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: presentCount }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "hafta" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Kat\u0131lmad\u0131" }), (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 text-red-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: absentCount }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "hafta" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Mazeretli" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-600", children: excusedCount }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "hafta" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckSquare, { className: "mr-2 h-5 w-5" }), "Haftal\u0131k Devam Kay\u0131tlar\u0131"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: attendance && attendance.length > 0 ? (attendance.map(function (record) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [getAttendanceIcon(record.status), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: ["Hafta ", record.week] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: new Date(record.date).toLocaleDateString('tr-TR') })] })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getAttendanceColor(record.status), children: getAttendanceText(record.status) })] }, record.id)); })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-muted-foreground", children: "Hen\u00FCz devam kayd\u0131 bulunmuyor." })) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Devam Takvimi" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mx-auto h-8 w-8 text-gray-400 mb-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Devam takvimi yak\u0131nda eklenecek" })] }) }) })] })] }) }));
}
