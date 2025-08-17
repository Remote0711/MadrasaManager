"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLessonPlans;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var AdminLayout_1 = require("@/components/AdminLayout");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var tr_1 = require("@/lib/tr");
function AdminLessonPlans() {
    var _a = (0, react_1.useState)("all"), selectedWeek = _a[0], setSelectedWeek = _a[1];
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/lesson-plans'],
    }), _c = _b.data, lessonPlans = _c === void 0 ? [] : _c, isLoading = _b.isLoading;
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/program-types'],
    }).data, programTypes = _d === void 0 ? [] : _d;
    // Enhanced lesson plans with calculated fields and program type information
    var enhancedLessonPlans = (0, react_1.useMemo)(function () {
        return lessonPlans.map(function (plan) {
            var programType = programTypes.find(function (pt) { return pt.id === plan.programTypeId; });
            return __assign(__assign({}, plan), { programType: programType, title: "".concat(plan.subject, " - Hafta ").concat(plan.week), totalPages: plan.pagesTo - plan.pagesFrom + 1, status: 'planned' });
        });
    }, [lessonPlans, programTypes]);
    // Filter lesson plans by selected week
    var filteredLessonPlans = (0, react_1.useMemo)(function () {
        if (selectedWeek === "all")
            return enhancedLessonPlans;
        return enhancedLessonPlans.filter(function (plan) { return plan.week.toString() === selectedWeek; });
    }, [enhancedLessonPlans, selectedWeek]);
    // Get unique weeks for filter dropdown
    var availableWeeks = (0, react_1.useMemo)(function () {
        var weeks = Array.from(new Set(enhancedLessonPlans.map(function (plan) { return plan.week; }))).sort(function (a, b) { return a - b; });
        return weeks;
    }, [enhancedLessonPlans]);
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'planned':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusText = function (status) {
        switch (status) {
            case 'completed':
                return 'Tamamlandı';
            case 'in-progress':
                return 'Devam Ediyor';
            case 'planned':
                return 'Planlandı';
            default:
                return 'Bilinmiyor';
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: tr_1.tr.lessonPlans }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Haftal\u0131k ders planlar\u0131n\u0131 g\u00F6r\u00FCnt\u00FCleyin ve takip edin" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedWeek, onValueChange: setSelectedWeek, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-[180px]", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Hafta se\u00E7in" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "T\u00FCm Haftalar" }), availableWeeks.map(function (week) { return ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: week.toString(), children: ["Hafta ", week] }, week)); })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-muted-foreground", children: [filteredLessonPlans.length, " plan g\u00F6r\u00FCnt\u00FCleniyor"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredLessonPlans.map(function (plan) {
                        var _a;
                        return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "mr-2 h-5 w-5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: plan.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-muted-foreground", children: [(_a = plan.programType) === null || _a === void 0 ? void 0 : _a.name, " - Seviye ", plan.classLevel] })] })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getStatusColor(plan.status), children: getStatusText(plan.status) })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-2 h-4 w-4" }), "Hafta ", plan.week] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mr-2 h-4 w-4" }), plan.totalPages, " sayfa (Sayfa ", plan.pagesFrom, "-", plan.pagesTo, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Konu:" }), " ", plan.subject] }) })] }) })] }, plan.id));
                    }) }), filteredLessonPlans.length === 0 && ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "flex flex-col items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-12 w-12 text-muted-foreground mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-muted-foreground mb-2", children: selectedWeek === "all" ? "Henüz ders planı bulunmuyor" : "Hafta ".concat(selectedWeek, " i\u00E7in ders plan\u0131 bulunamad\u0131") }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground text-center", children: selectedWeek === "all"
                                    ? "Sistem henüz ders planı içermiyor."
                                    : "Bu hafta için henüz plan oluşturulmamış. Farklı bir hafta seçin." })] }) })), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-2 h-5 w-5" }), "Ders Plan\u0131 Listesi (", filteredLessonPlans.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Plan Ba\u015Fl\u0131\u011F\u0131" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Program & Seviye" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Hafta" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Sayfa Aral\u0131\u011F\u0131" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Durum" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredLessonPlans.map(function (plan) {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-muted/50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 font-medium", children: plan.title }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 text-muted-foreground", children: [(_a = plan.programType) === null || _a === void 0 ? void 0 : _a.name, " - Seviye ", plan.classLevel] }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 text-muted-foreground", children: ["Hafta ", plan.week] }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 text-muted-foreground", children: ["Sayfa ", plan.pagesFrom, "-", plan.pagesTo, " (", plan.totalPages, " sayfa)"] }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getStatusColor(plan.status), children: getStatusText(plan.status) }) })] }, plan.id));
                                            }) })] }) }) })] })] }) }));
}
