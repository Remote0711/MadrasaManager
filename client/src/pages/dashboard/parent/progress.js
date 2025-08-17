"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParentProgress;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var ParentLayout_1 = require("@/components/ParentLayout");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
function ParentProgress() {
    var _a, _b, _c;
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['/api/parent/child'],
    }), child = _d.data, childLoading = _d.isLoading;
    var _e = (0, react_query_1.useQuery)({
        queryKey: ["/api/student/".concat(child === null || child === void 0 ? void 0 : child.id, "/progress")],
        enabled: !!(child === null || child === void 0 ? void 0 : child.id),
    }), progress = _e.data, progressLoading = _e.isLoading;
    if (childLoading || progressLoading) {
        return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    if (!child) {
        return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "\u00C7ocuk bilgisi bulunamad\u0131." }) }) }));
    }
    var getProgressColor = function (percentage) {
        if (percentage >= 90)
            return 'text-green-600';
        if (percentage >= 70)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    var getProgressBadgeColor = function (percentage) {
        if (percentage >= 90)
            return 'bg-green-100 text-green-800';
        if (percentage >= 70)
            return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };
    // Calculate overall progress
    var overallProgress = (progress === null || progress === void 0 ? void 0 : progress.length) > 0
        ? Math.round(progress.reduce(function (sum, p) { return sum + (p.pagesDone / p.pagesPlanned * 100); }, 0) / progress.length)
        : 0;
    var totalPagesCompleted = (progress === null || progress === void 0 ? void 0 : progress.reduce(function (sum, p) { return sum + p.pagesDone; }, 0)) || 0;
    var totalPagesPlanned = (progress === null || progress === void 0 ? void 0 : progress.reduce(function (sum, p) { return sum + p.pagesPlanned; }, 0)) || 0;
    return ((0, jsx_runtime_1.jsx)(ParentLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between items-center", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: tr_1.tr.progress }), (0, jsx_runtime_1.jsxs)("p", { className: "text-muted-foreground", children: [child.firstName, " ", child.lastName, " - ", (_a = child.class) === null || _a === void 0 ? void 0 : _a.name, " (", (_c = (_b = child.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name, ")"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Genel \u0130lerleme" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold ".concat(getProgressColor(overallProgress)), children: ["%", overallProgress] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: overallProgress, className: "mt-2" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Tamamlanan" }), (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: totalPagesCompleted }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "sayfa" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Hedef" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-primary", children: totalPagesPlanned }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "sayfa" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Aktif Hafta" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-primary", children: (progress === null || progress === void 0 ? void 0 : progress.length) || 0 }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "hafta" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-2 h-5 w-5" }), "Haftal\u0131k \u0130lerleme Raporu"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: progress && progress.length > 0 ? (progress.map(function (weekProgress) {
                                    var percentage = Math.round((weekProgress.pagesDone / weekProgress.pagesPlanned) * 100);
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: ["Hafta ", weekProgress.week] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-muted-foreground", children: [weekProgress.pagesDone, " / ", weekProgress.pagesPlanned, " sayfa"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32", children: (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: percentage, className: "h-2" }) }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: getProgressBadgeColor(percentage), children: ["%", percentage] })] })] }, weekProgress.id));
                                })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-muted-foreground", children: "Hen\u00FCz ilerleme kayd\u0131 bulunmuyor." })) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "\u0130lerleme Grafi\u011Fi" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mx-auto h-8 w-8 text-gray-400 mb-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "\u0130lerleme grafi\u011Fi yak\u0131nda eklenecek" })] }) }) })] })] }) }));
}
