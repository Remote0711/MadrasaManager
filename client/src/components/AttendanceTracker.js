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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttendanceTracker;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var dialog_1 = require("@/components/ui/dialog");
var label_1 = require("@/components/ui/label");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
var lucide_react_1 = require("lucide-react");
function AttendanceTracker(_a) {
    var _this = this;
    var students = _a.students;
    var _b = (0, react_1.useState)(false), timeDialogOpen = _b[0], setTimeDialogOpen = _b[1];
    var _c = (0, react_1.useState)(null), selectedStudent = _c[0], setSelectedStudent = _c[1];
    var _d = (0, react_1.useState)('geldi'), selectedStatus = _d[0], setSelectedStatus = _d[1];
    var _e = (0, react_1.useState)(''), arrivalTime = _e[0], setArrivalTime = _e[1];
    var _f = (0, react_1.useState)(''), departureTime = _f[0], setDepartureTime = _f[1];
    var _g = (0, react_1.useState)(''), notes = _g[0], setNotes = _g[1];
    // Track multiple attendance statuses for each student to show visual feedback
    var _h = (0, react_1.useState)({}), studentAttendanceStatus = _h[0], setStudentAttendanceStatus = _h[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var attendanceMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/teacher/attendance", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (_, variables) {
            // Update local state to show visual feedback
            setStudentAttendanceStatus(function (prev) {
                var _a;
                var currentStatuses = prev[variables.studentId] || new Set();
                var newStatuses = new Set(currentStatuses);
                // Handle mutually exclusive statuses
                if (variables.status === 'gelmedi') {
                    // If absent, clear all other statuses
                    newStatuses.clear();
                    newStatuses.add('gelmedi');
                }
                else if (variables.status === 'geldi') {
                    // If present, remove absent and add present
                    newStatuses.delete('gelmedi');
                    newStatuses.add('geldi');
                }
                else {
                    // For other statuses (late, early departure, excused), add to existing
                    newStatuses.delete('gelmedi'); // Can't be absent if they have other statuses
                    newStatuses.add('geldi'); // Must be present to have other statuses
                    newStatuses.add(variables.status);
                }
                return __assign(__assign({}, prev), (_a = {}, _a[variables.studentId] = newStatuses, _a));
            });
            toast({
                title: tr_1.tr.success,
                description: tr_1.tr.attendanceMarked,
            });
            queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
            setTimeDialogOpen(false);
            setSelectedStudent(null);
            setArrivalTime('');
            setDepartureTime('');
            setNotes('');
        },
        onError: function (error) {
            console.error('Attendance error:', error);
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.attendanceMarkError,
                variant: "destructive",
            });
        },
    });
    var handleMarkAttendance = function (studentId, status) {
        var currentWeek = Math.ceil((new Date().getTime() - new Date(2024, 8, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
        // Immediately update visual state for feedback
        setStudentAttendanceStatus(function (prev) {
            var _a;
            var currentStatuses = prev[studentId] || new Set();
            var newStatuses = new Set(currentStatuses);
            // Handle mutually exclusive statuses
            if (status === 'gelmedi') {
                // If absent, clear all other statuses
                newStatuses.clear();
                newStatuses.add('gelmedi');
            }
            else if (status === 'geldi') {
                // If present, remove absent and add present
                newStatuses.delete('gelmedi');
                newStatuses.add('geldi');
            }
            else {
                // For other statuses (late, early departure, excused), add to existing
                newStatuses.delete('gelmedi'); // Can't be absent if they have other statuses
                newStatuses.add('geldi'); // Must be present to have other statuses
                newStatuses.add(status);
            }
            return __assign(__assign({}, prev), (_a = {}, _a[studentId] = newStatuses, _a));
        });
        if (status === 'gec_geldi' || status === 'erken_cikti') {
            var student = students.find(function (s) { return s.id === studentId; });
            setSelectedStudent(student || null);
            setSelectedStatus(status);
            setTimeDialogOpen(true);
        }
        else {
            attendanceMutation.mutate({ studentId: studentId, week: currentWeek, status: status });
        }
    };
    // Helper function to get button style based on status
    var getButtonStyle = function (studentId, status) {
        var studentStatuses = studentAttendanceStatus[studentId] || new Set();
        var isSelected = studentStatuses.has && studentStatuses.has(status);
        var baseClasses = "flex-1 text-sm py-2 px-3 rounded-md transition-all duration-200 font-medium";
        switch (status) {
            case 'geldi':
                return "".concat(baseClasses, " ").concat(isSelected
                    ? 'bg-green-600 text-white shadow-lg border-2 border-green-700'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300');
            case 'gec_geldi':
                return "".concat(baseClasses, " ").concat(isSelected
                    ? 'bg-yellow-600 text-white shadow-lg border-2 border-yellow-700'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300');
            case 'erken_cikti':
                return "".concat(baseClasses, " ").concat(isSelected
                    ? 'bg-orange-600 text-white shadow-lg border-2 border-orange-700'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300');
            case 'mazeretli':
                return "".concat(baseClasses, " ").concat(isSelected
                    ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300');
            case 'gelmedi':
                return "".concat(baseClasses, " ").concat(isSelected
                    ? 'bg-red-600 text-white shadow-lg border-2 border-red-700'
                    : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300');
            default:
                return baseClasses;
        }
    };
    var handleTimeSubmit = function () {
        if (!selectedStudent)
            return;
        var currentWeek = Math.ceil((new Date().getTime() - new Date(2024, 8, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
        attendanceMutation.mutate({
            studentId: selectedStudent.id,
            week: currentWeek,
            status: selectedStatus,
            arrivalTime: selectedStatus === 'gec_geldi' ? arrivalTime : undefined,
            departureTime: selectedStatus === 'erken_cikti' ? departureTime : undefined,
            notes: notes || undefined,
        });
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: students.map(function (student) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 text-[#005C5C]" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-900", children: [student.firstName, " ", student.lastName] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsxs)("button", { className: getButtonStyle(student.id, 'geldi'), onClick: function () { return handleMarkAttendance(student.id, 'geldi'); }, disabled: attendanceMutation.isPending, children: ["\u2713 ", tr_1.tr.present] }), (0, jsx_runtime_1.jsxs)("button", { className: getButtonStyle(student.id, 'gec_geldi'), onClick: function () { return handleMarkAttendance(student.id, 'gec_geldi'); }, disabled: attendanceMutation.isPending, children: ["\u23F0 ", tr_1.tr.lateArrival] }), (0, jsx_runtime_1.jsxs)("button", { className: getButtonStyle(student.id, 'erken_cikti'), onClick: function () { return handleMarkAttendance(student.id, 'erken_cikti'); }, disabled: attendanceMutation.isPending, children: ["\u23F0 ", tr_1.tr.earlyDeparture] }), (0, jsx_runtime_1.jsxs)("button", { className: getButtonStyle(student.id, 'mazeretli'), onClick: function () { return handleMarkAttendance(student.id, 'mazeretli'); }, disabled: attendanceMutation.isPending, children: ["\uD83D\uDCCB ", tr_1.tr.excused] }), (0, jsx_runtime_1.jsxs)("button", { className: getButtonStyle(student.id, 'gelmedi'), onClick: function () { return handleMarkAttendance(student.id, 'gelmedi'); }, disabled: attendanceMutation.isPending, children: ["\u2717 ", tr_1.tr.absent] })] })] }, student.id)); }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: timeDialogOpen, onOpenChange: setTimeDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "bg-[#FAF8F4]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "text-[#005C5C] flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-5 h-5" }), selectedStatus === 'gec_geldi' ? tr_1.tr.lateArrival : tr_1.tr.earlyDeparture, " - ", selectedStudent === null || selectedStudent === void 0 ? void 0 : selectedStudent.firstName, " ", selectedStudent === null || selectedStudent === void 0 ? void 0 : selectedStudent.lastName] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [selectedStatus === 'gec_geldi' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "arrivalTime", children: tr_1.tr.arrivalTime }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "arrivalTime", type: "time", value: arrivalTime, onChange: function (e) { return setArrivalTime(e.target.value); }, className: "border-[#E5E5E5] focus:border-[#005C5C]" })] })), selectedStatus === 'erken_cikti' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "departureTime", children: tr_1.tr.departureTime }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "departureTime", type: "time", value: departureTime, onChange: function (e) { return setDepartureTime(e.target.value); }, className: "border-[#E5E5E5] focus:border-[#005C5C]" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "notes", children: tr_1.tr.attendanceNotes }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "notes", value: notes, onChange: function (e) { return setNotes(e.target.value); }, placeholder: "Ek notlar (opsiyonel)", className: "border-[#E5E5E5] focus:border-[#005C5C]" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return setTimeDialogOpen(false); }, className: "border-[#005C5C] text-[#005C5C]", children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleTimeSubmit, disabled: attendanceMutation.isPending ||
                                                (selectedStatus === 'gec_geldi' && !arrivalTime) ||
                                                (selectedStatus === 'erken_cikti' && !departureTime), className: "bg-[#005C5C] hover:bg-[#004A4A] text-white", children: attendanceMutation.isPending ? tr_1.tr.loading : tr_1.tr.save })] })] })] }) })] }));
}
