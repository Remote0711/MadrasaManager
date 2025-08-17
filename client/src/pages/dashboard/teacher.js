"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var TeacherLayout_1 = require("@/components/TeacherLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var ProgressBar_1 = require("@/components/ProgressBar");
var AttendanceTracker_1 = require("@/components/AttendanceTracker");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
function TeacherDashboard() {
    var _this = this;
    var _a = (0, react_1.useState)(""), selectedStudent = _a[0], setSelectedStudent = _a[1];
    var _b = (0, react_1.useState)(""), pagesDone = _b[0], setPagesDone = _b[1];
    var _c = (0, react_1.useState)(""), behaviorNote = _c[0], setBehaviorNote = _c[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['/api/teacher/students'],
    }), _e = _d.data, students = _e === void 0 ? [] : _e, isLoading = _d.isLoading;
    var progressMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/teacher/progress", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: tr_1.tr.success,
                description: tr_1.tr.progressSaved,
            });
            setSelectedStudent("");
            setPagesDone("");
            setBehaviorNote("");
            queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
        },
        onError: function () {
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.progressSaveError,
                variant: "destructive",
            });
        },
    });
    var behaviorMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/teacher/behavior", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
    });
    var handleProgressSubmit = function (e) {
        e.preventDefault();
        if (!selectedStudent || !pagesDone) {
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.fillAllFields,
                variant: "destructive",
            });
            return;
        }
        var currentWeek = 5; // This would normally be calculated
        var pagesPlanned = 30; // This would come from lesson plan
        progressMutation.mutate({
            studentId: selectedStudent,
            week: currentWeek,
            pagesDone: parseInt(pagesDone),
            pagesPlanned: pagesPlanned,
        });
        if (behaviorNote.trim()) {
            behaviorMutation.mutate({
                studentId: selectedStudent,
                week: currentWeek,
                comment: behaviorNote.trim(),
            });
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    // Mock data for demonstration - in real app this would come from API
    var classStats = {
        totalStudents: students.length,
        presentToday: Math.floor(students.length * 0.8),
        averageProgress: 78,
    };
    return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: tr_1.tr.teacherDashboard }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: [tr_1.tr.currentWeek, ":"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-900", children: "Hafta 5" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "S\u0131n\u0131f\u0131m: T2a" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: classStats.totalStudents }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: tr_1.tr.totalStudents })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: classStats.presentToday }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: tr_1.tr.presentToday })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-primary", children: [classStats.averageProgress, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: tr_1.tr.averageProgress })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: tr_1.tr.weeklyProgressInput }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleProgressSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "block text-sm font-medium text-gray-700", children: tr_1.tr.selectStudent }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedStudent, onValueChange: setSelectedStudent, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "mt-1", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: tr_1.tr.selectStudent }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: students.map(function (student) { return ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: student.id, children: [student.firstName, " ", student.lastName] }, student.id)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "block text-sm font-medium text-gray-700", children: tr_1.tr.completedPages }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", value: pagesDone, onChange: function (e) { return setPagesDone(e.target.value); }, className: "mt-1", placeholder: "15" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "block text-sm font-medium text-gray-700", children: tr_1.tr.behaviorNote }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { rows: 3, value: behaviorNote, onChange: function (e) { return setBehaviorNote(e.target.value); }, className: "mt-1", placeholder: tr_1.tr.behaviorNotePlaceholder })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full", disabled: progressMutation.isPending, children: progressMutation.isPending ? tr_1.tr.saving : tr_1.tr.saveProgress })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: tr_1.tr.attendance }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(AttendanceTracker_1.default, { students: students }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: tr_1.tr.studentPerformanceOverview }), (0, jsx_runtime_1.jsxs)(button_1.Button, { disabled: true, variant: "outline", children: [(0, jsx_runtime_1.jsx)("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }) }), tr_1.tr.aiReport, " (", tr_1.tr.comingSoon, ")"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: tr_1.tr.student }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: tr_1.tr.progress }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: tr_1.tr.attendanceRate }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: tr_1.tr.lastUpdate })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: students.slice(0, 10).map(function (student, index) {
                                                // Mock progress data - in real app this would come from API
                                                var progressPercentage = Math.floor(Math.random() * 40) + 50; // 50-90%
                                                var attendanceRate = Math.floor(Math.random() * 30) + 70; // 70-100%
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium text-gray-900", children: [student.firstName, " ", student.lastName] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)(ProgressBar_1.default, { percentage: progressPercentage }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: [attendanceRate, "%"] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: index < 3 ? "".concat(index + 1, " g\u00FCn \u00F6nce") : "".concat(index + 1, " g\u00FCn \u00F6nce") })] }, student.id));
                                            }) })] }) }) })] })] }) }));
}
