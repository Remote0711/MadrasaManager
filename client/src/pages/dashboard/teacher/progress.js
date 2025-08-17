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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherProgress;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var TeacherLayout_1 = require("@/components/TeacherLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var dialog_1 = require("@/components/ui/dialog");
var label_1 = require("@/components/ui/label");
var checkbox_1 = require("@/components/ui/checkbox");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
var queryClient_1 = require("@/lib/queryClient");
var react_1 = require("react");
function TeacherProgress() {
    var _this = this;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(null), editingStudent = _a[0], setEditingStudent = _a[1];
    var _b = (0, react_1.useState)(false), editDialogOpen = _b[0], setEditDialogOpen = _b[1];
    var _c = (0, react_1.useState)(""), weeklyPages = _c[0], setWeeklyPages = _c[1];
    var _d = (0, react_1.useState)(""), quranPage = _d[0], setQuranPage = _d[1];
    var _e = (0, react_1.useState)(""), surahName = _e[0], setSurahName = _e[1];
    var _f = (0, react_1.useState)(""), ayahNumber = _f[0], setAyahNumber = _f[1];
    var _g = (0, react_1.useState)(""), behaviorNote = _g[0], setBehaviorNote = _g[1];
    var _h = (0, react_1.useState)([]), attendanceStatus = _h[0], setAttendanceStatus = _h[1];
    var _j = (0, react_1.useState)({}), studentAttendanceMap = _j[0], setStudentAttendanceMap = _j[1];
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['/api/teacher/students'],
    }), students = _k.data, isLoading = _k.isLoading;
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
            queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
            setEditingStudent(null);
            setEditDialogOpen(false);
            setWeeklyPages("");
            setQuranPage("");
            setSurahName("");
            setAyahNumber("");
            setBehaviorNote("");
            setAttendanceStatus([]);
        },
    });
    var getCurrentWeek = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    };
    var handleEdit = function (student) {
        setEditingStudent(student);
        setEditDialogOpen(true);
        // Pre-fill with current data if available
        setWeeklyPages("");
        setQuranPage("");
        setSurahName("");
        setAyahNumber("");
        setBehaviorNote("");
        setAttendanceStatus([]);
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!editingStudent || !weeklyPages)
            return;
        progressMutation.mutate({
            studentId: editingStudent.id,
            week: getCurrentWeek(),
            pagesDone: parseInt(weeklyPages),
            pagesPlanned: parseInt(weeklyPages) + 5, // Set planned pages slightly higher than completed
        });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    var getProgressColor = function (progress) {
        if (progress >= 90)
            return 'bg-green-100 text-green-800';
        if (progress >= 70)
            return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };
    // Stable mock progress data using student ID as seed
    var mockProgress = function (studentId) {
        // Create a simple hash from studentId to get consistent pseudo-random numbers
        var hash = 0;
        for (var i = 0; i < studentId.length; i++) {
            var char = studentId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Use the hash to generate a consistent progress percentage
        var progress = Math.abs(hash) % 100;
        return Math.max(20, progress); // Ensure minimum 20% progress
    };
    // Stable mock weekly pages using student ID as seed
    var mockWeeklyPages = function (studentId) {
        var hash = 0;
        for (var i = 0; i < studentId.length; i++) {
            var char = studentId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // Generate consistent weekly pages between 5 and 30
        return Math.abs(hash) % 26 + 5;
    };
    // Stable mock status using student ID as seed
    var mockStatus = function (studentId) {
        var hash = 0;
        for (var i = 0; i < studentId.length; i++) {
            var char = studentId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        var statusIndex = Math.abs(hash) % 3;
        return ['successful', 'improving', 'needs_attention'][statusIndex];
    };
    var toggleAttendanceStatus = function (studentId, status) {
        setStudentAttendanceMap(function (prev) {
            var _a;
            var currentStatuses = prev[studentId] || [];
            var updatedStatuses = currentStatuses.includes(status)
                ? currentStatuses.filter(function (s) { return s !== status; })
                : __spreadArray(__spreadArray([], currentStatuses, true), [status], false);
            return __assign(__assign({}, prev), (_a = {}, _a[studentId] = updatedStatuses, _a));
        });
    };
    var getStudentAttendanceStatuses = function (studentId) {
        return studentAttendanceMap[studentId] || [];
    };
    return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 islamic-pattern" }), (0, jsx_runtime_1.jsx)("div", { className: "relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-xl border border-primary/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent", children: tr_1.tr.progress }), (0, jsx_runtime_1.jsxs)("p", { className: "text-muted-foreground mt-2 text-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-block w-1 h-4 bg-primary/60 mr-2 rounded" }), "\u00D6\u011Frenci ilerlemelerini takip edin ve d\u00FCzenleyin - Hafta ", getCurrentWeek()] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground arabic-text mt-2", children: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0627\u0644\u0631\u064E\u0651\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u064E\u0651\u062D\u0650\u064A\u0645\u0650" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-primary", children: (students === null || students === void 0 ? void 0 : students.length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Toplam \u00D6\u011Frenci" })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-3 h-6 w-6 text-primary" }), "\u00D6\u011Frenci \u0130lerleme Takibi - Hafta ", getCurrentWeek()] }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground mt-2", children: "\u00D6\u011Frencilerinizin haftal\u0131k ilerlemelerini takip edin ve d\u00FCzenleyin" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b-2 border-primary/20", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "\u00D6\u011Frenci" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "Haftal\u0131k Sayfa" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "Kur'an Sayfas\u0131" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "Ezber Durumu" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "Devam Durumu" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold", children: "Genel \u0130lerleme" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-4 px-4 font-semibold", children: "\u0130\u015Flemler" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: students === null || students === void 0 ? void 0 : students.map(function (student) {
                                                var progress = mockProgress(student.id);
                                                var weeklyPages = mockWeeklyPages(student.id);
                                                var status = mockStatus(student.id);
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-primary/5 transition-colors", children: [(0, jsx_runtime_1.jsxs)("td", { className: "py-4 px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-foreground", children: [student.firstName, " ", student.lastName] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "\u00D6\u011Frenci" })] }), (0, jsx_runtime_1.jsxs)("td", { className: "py-4 px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-primary", children: [weeklyPages, " sayfa"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Bu hafta" })] }), (0, jsx_runtime_1.jsxs)("td", { className: "py-4 px-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-secondary", children: Math.abs(student.id.charCodeAt(1)) % 604 + 1 }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Mushaf" })] }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Fatiha" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-muted-foreground", children: [Math.abs(student.id.charCodeAt(2)) % 7 + 1, ". Ayet"] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 w-fit", children: "Geldi" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: getStudentAttendanceStatuses(student.id).includes('late') ? "default" : "outline", className: "text-xs px-2 py-1 h-6 ".concat(getStudentAttendanceStatuses(student.id).includes('late') ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'hover:bg-yellow-50'), onClick: function () { return toggleAttendanceStatus(student.id, 'late'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3 mr-1" }), "Ge\u00E7"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: getStudentAttendanceStatuses(student.id).includes('early') ? "default" : "outline", className: "text-xs px-2 py-1 h-6 ".concat(getStudentAttendanceStatuses(student.id).includes('early') ? 'bg-orange-100 text-orange-800 border-orange-300' : 'hover:bg-orange-50'), onClick: function () { return toggleAttendanceStatus(student.id, 'early'); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "w-3 h-3 mr-1" }), "Erken"] })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: getProgressColor(progress), children: ["%", progress] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-right", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleEdit(student); }, className: "islamic-button-secondary", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "mr-2 h-4 w-4" }), "D\u00FCzenle"] }) })] }, student.id));
                                            }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[600px] islamic-card", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent", children: ["\u0130lerleme D\u00FCzenle - ", editingStudent === null || editingStudent === void 0 ? void 0 : editingStudent.firstName, " ", editingStudent === null || editingStudent === void 0 ? void 0 : editingStudent.lastName] }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "weeklyPages", className: "text-sm font-medium", children: "Haftal\u0131k Tamamlanan Sayfa Say\u0131s\u0131 *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "weeklyPages", type: "number", placeholder: "0", value: weeklyPages, onChange: function (e) { return setWeeklyPages(e.target.value); }, min: "0", max: "100", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "quranPage", className: "text-sm font-medium", children: "Kur'an Son Sayfa (Mushaf)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "quranPage", type: "number", placeholder: "1-604", value: quranPage, onChange: function (e) { return setQuranPage(e.target.value); }, min: "1", max: "604" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "surahName", className: "text-sm font-medium", children: "Ezber - Surah Ad\u0131" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "surahName", type: "text", placeholder: "\u00D6rn: Fatiha, Bakara", value: surahName, onChange: function (e) { return setSurahName(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "ayahNumber", className: "text-sm font-medium", children: "Ayet Numaras\u0131" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "ayahNumber", type: "number", placeholder: "1", value: ayahNumber, onChange: function (e) { return setAyahNumber(e.target.value); }, min: "1" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium", children: "Devam Durumu" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "came-late", checked: attendanceStatus.includes('late'), onCheckedChange: function (checked) {
                                                                    if (checked) {
                                                                        setAttendanceStatus(__spreadArray(__spreadArray([], attendanceStatus, true), ['late'], false));
                                                                    }
                                                                    else {
                                                                        setAttendanceStatus(attendanceStatus.filter(function (status) { return status !== 'late'; }));
                                                                    }
                                                                } }), (0, jsx_runtime_1.jsxs)(label_1.Label, { htmlFor: "came-late", className: "flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 mr-2 text-yellow-600" }), "Ge\u00E7 geldi"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "left-early", checked: attendanceStatus.includes('early'), onCheckedChange: function (checked) {
                                                                    if (checked) {
                                                                        setAttendanceStatus(__spreadArray(__spreadArray([], attendanceStatus, true), ['early'], false));
                                                                    }
                                                                    else {
                                                                        setAttendanceStatus(attendanceStatus.filter(function (status) { return status !== 'early'; }));
                                                                    }
                                                                } }), (0, jsx_runtime_1.jsxs)(label_1.Label, { htmlFor: "left-early", className: "flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "w-4 h-4 mr-2 text-orange-600" }), "Erken \u00E7\u0131kt\u0131"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "behaviorNote", className: "text-sm font-medium", children: "Davran\u0131\u015F Notu (De\u011Ferlendirme)" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "behaviorNote", placeholder: "\u00D6\u011Frencinin haftal\u0131k davran\u0131\u015F de\u011Ferlendirmesi...", value: behaviorNote, onChange: function (e) { return setBehaviorNote(e.target.value); }, rows: 3 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setEditDialogOpen(false); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "mr-2 h-4 w-4" }), "\u0130ptal"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", disabled: !weeklyPages || progressMutation.isPending, className: "islamic-button", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), progressMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'] })] })] })] }) })] }) }));
}
