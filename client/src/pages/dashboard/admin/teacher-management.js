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
exports.default = TeacherManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var AdminLayout_1 = require("@/components/AdminLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var dialog_1 = require("@/components/ui/dialog");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
function TeacherManagement() {
    var _this = this;
    var _a = (0, react_1.useState)(false), assignmentDialogOpen = _a[0], setAssignmentDialogOpen = _a[1];
    var _b = (0, react_1.useState)(false), attendanceDialogOpen = _b[0], setAttendanceDialogOpen = _b[1];
    var _c = (0, react_1.useState)(""), selectedTeacherId = _c[0], setSelectedTeacherId = _c[1];
    var _d = (0, react_1.useState)(""), selectedClassId = _d[0], setSelectedClassId = _d[1];
    var _e = (0, react_1.useState)(""), selectedSubject = _e[0], setSelectedSubject = _e[1];
    var _f = (0, react_1.useState)("present"), attendanceStatus = _f[0], setAttendanceStatus = _f[1];
    var _g = (0, react_1.useState)(""), arrivalTime = _g[0], setArrivalTime = _g[1];
    var _h = (0, react_1.useState)(""), sessionNotes = _h[0], setSessionNotes = _h[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/teacher-assignments'],
    }), _k = _j.data, teachers = _k === void 0 ? [] : _k, teachersLoading = _j.isLoading;
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/teachers'],
    }).data, allTeachers = _l === void 0 ? [] : _l;
    var _m = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/classes'],
    }).data, classes = _m === void 0 ? [] : _m;
    var createAssignmentMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/teacher-assignments", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-assignments'] });
            setAssignmentDialogOpen(false);
            setSelectedTeacherId("");
            setSelectedClassId("");
            setSelectedSubject("");
            toast({ title: tr_1.tr.success, description: "Öğretmen ataması başarıyla oluşturuldu" });
        },
        onError: function () {
            toast({ title: tr_1.tr.error, description: "Atama oluşturulurken hata oluştu", variant: "destructive" });
        },
    });
    var deleteAssignmentMutation = (0, react_query_1.useMutation)({
        mutationFn: function (assignmentId) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("DELETE", "/api/admin/teacher-assignments/".concat(assignmentId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-assignments'] });
            toast({ title: tr_1.tr.success, description: "Öğretmen ataması başarıyla kaldırıldı" });
        },
        onError: function () {
            toast({ title: tr_1.tr.error, description: "Atama kaldırılırken hata oluştu", variant: "destructive" });
        },
    });
    var createAttendanceMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/teacher-attendance", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-attendance'] });
            setAttendanceDialogOpen(false);
            setSelectedTeacherId("");
            setAttendanceStatus("present");
            setArrivalTime("");
            setSessionNotes("");
            toast({ title: tr_1.tr.success, description: "Öğretmen devamı kaydedildi" });
        },
        onError: function () {
            toast({ title: tr_1.tr.error, description: "Devam kaydedilirken hata oluştu", variant: "destructive" });
        },
    });
    var handleCreateAssignment = function () {
        if (!selectedTeacherId || !selectedClassId || !selectedSubject) {
            toast({ title: tr_1.tr.error, description: "Lütfen tüm alanları doldurun", variant: "destructive" });
            return;
        }
        createAssignmentMutation.mutate({
            teacherId: selectedTeacherId,
            classId: selectedClassId,
            subject: selectedSubject,
        });
    };
    var handleDeleteAssignment = function (assignmentId) {
        if (confirm("Bu atamayı kaldırmak istediğinizden emin misiniz?")) {
            deleteAssignmentMutation.mutate(assignmentId);
        }
    };
    var handleCreateAttendance = function () {
        if (!selectedTeacherId) {
            toast({ title: tr_1.tr.error, description: "Lütfen öğretmen seçin", variant: "destructive" });
            return;
        }
        var today = new Date().toISOString().split('T')[0];
        createAttendanceMutation.mutate({
            teacherId: selectedTeacherId,
            date: today,
            status: attendanceStatus,
            arrivalTime: arrivalTime || undefined,
            notes: sessionNotes || undefined,
        });
    };
    var getSubjectColor = function (subject) {
        switch (subject) {
            case 'temel_bilgiler': return 'bg-blue-100 text-blue-800';
            case 'kuran': return 'bg-green-100 text-green-800';
            case 'ezber': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getSubjectName = function (subject) {
        switch (subject) {
            case 'temel_bilgiler': return tr_1.tr.temelBilgiler;
            case 'kuran': return tr_1.tr.kuran;
            case 'ezber': return tr_1.tr.ezber;
            default: return subject;
        }
    };
    if (teachersLoading) {
        return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-[400px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#005C5C] mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-[#005C5C]", children: tr_1.tr.loading })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[#005C5C]", children: tr_1.tr.teacherManagement }), (0, jsx_runtime_1.jsx)("p", { className: "text-[#7A7A7A] mt-1", children: "\u00D6\u011Fretmen atamalar\u0131n\u0131 ve devam\u0131n\u0131 y\u00F6netin" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: assignmentDialogOpen, onOpenChange: setAssignmentDialogOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "bg-[#005C5C] hover:bg-[#004A4A] text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-2" }), tr_1.tr.assignTeacher] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "bg-[#FAF8F4]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { className: "text-[#005C5C]", children: tr_1.tr.teacherAssignments }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "teacher", children: tr_1.tr.teacher }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedTeacherId, onValueChange: setSelectedTeacherId, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "\u00D6\u011Fretmen se\u00E7in" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: allTeachers.map(function (teacher) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: teacher.id, children: teacher.name }, teacher.id)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "class", children: tr_1.tr.class }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedClassId, onValueChange: setSelectedClassId, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "S\u0131n\u0131f se\u00E7in" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: classes.map(function (cls) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: cls.id, children: cls.name }, cls.id)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "subject", children: tr_1.tr.subjects }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedSubject, onValueChange: setSelectedSubject, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Ders se\u00E7in" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "temel_bilgiler", children: tr_1.tr.temelBilgiler }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "kuran", children: tr_1.tr.kuran }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ezber", children: tr_1.tr.ezber })] })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleCreateAssignment, disabled: createAssignmentMutation.isPending, className: "w-full bg-[#005C5C] hover:bg-[#004A4A] text-white", children: createAssignmentMutation.isPending ? tr_1.tr.loading : tr_1.tr.assignTeacher })] })] })] }), (0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: attendanceDialogOpen, onOpenChange: setAttendanceDialogOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "border-[#005C5C] text-[#005C5C] hover:bg-[#005C5C] hover:text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 mr-2" }), tr_1.tr.teacherAttendance] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "bg-[#FAF8F4]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { className: "text-[#005C5C]", children: tr_1.tr.teacherAttendance }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "teacher", children: tr_1.tr.teacher }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedTeacherId, onValueChange: setSelectedTeacherId, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "\u00D6\u011Fretmen se\u00E7in" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: allTeachers.map(function (teacher) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: teacher.id, children: teacher.name }, teacher.id)); }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "status", children: tr_1.tr.attendanceStatus }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: attendanceStatus, onValueChange: setAttendanceStatus, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "present", children: tr_1.tr.present }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "absent", children: tr_1.tr.absent }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "late", children: "Ge\u00E7" })] })] })] }), attendanceStatus !== "absent" && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "arrivalTime", children: tr_1.tr.arrivalTime }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "time", value: arrivalTime, onChange: function (e) { return setArrivalTime(e.target.value); }, className: "border-[#E5E5E5] focus:border-[#005C5C]" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "notes", children: tr_1.tr.sessionNotes }), (0, jsx_runtime_1.jsx)(input_1.Input, { value: sessionNotes, onChange: function (e) { return setSessionNotes(e.target.value); }, placeholder: "Ders notlar\u0131 (opsiyonel)", className: "border-[#E5E5E5] focus:border-[#005C5C]" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleCreateAttendance, disabled: createAttendanceMutation.isPending, className: "w-full bg-[#005C5C] hover:bg-[#004A4A] text-white", children: createAttendanceMutation.isPending ? tr_1.tr.loading : tr_1.tr.save })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white border-l-4 border-l-[#005C5C]", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Toplam \u00D6\u011Fretmen" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-[#005C5C]", children: allTeachers.length })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-8 h-8 text-[#005C5C]" })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white border-l-4 border-l-blue-500", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Aktif Atamalar" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: teachers.reduce(function (acc, teacher) { return acc + teacher.teacherSubjectAssignments.length; }, 0) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-8 h-8 text-blue-500" })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white border-l-4 border-l-green-500", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Bug\u00FCn Mevcut" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-green-600", children: teachers.filter(function (teacher) {
                                                        return teacher.teacherAttendance.some(function (att) {
                                                            return att.date === new Date().toISOString().split('T')[0] && att.status === 'present';
                                                        });
                                                    }).length })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "w-8 h-8 text-green-500" })] }) }) }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-white border-l-4 border-l-red-500", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Bug\u00FCn Yok" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-red-600", children: teachers.filter(function (teacher) {
                                                        return teacher.teacherAttendance.some(function (att) {
                                                            return att.date === new Date().toISOString().split('T')[0] && att.status === 'absent';
                                                        });
                                                    }).length })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.UserX, { className: "w-8 h-8 text-red-500" })] }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-white", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-[#005C5C]", children: tr_1.tr.teacherAssignments }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: tr_1.tr.teacher }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: tr_1.tr.class }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: tr_1.tr.subjects }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Program T\u00FCr\u00FC" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Son Devam" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { className: "text-right", children: tr_1.tr.actions })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: teachers.map(function (teacher) { return (teacher.teacherSubjectAssignments.map(function (assignment, index) { return ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [index === 0 && ((0, jsx_runtime_1.jsxs)(table_1.TableCell, { rowSpan: teacher.teacherSubjectAssignments.length || 1, children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: teacher.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-[#7A7A7A]", children: teacher.email })] })), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: assignment.class.name }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getSubjectColor(assignment.subject), children: getSubjectName(assignment.subject) }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: assignment.class.programType.name }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: teacher.teacherAttendance.length > 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { children: teacher.teacherAttendance[0].date }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: teacher.teacherAttendance[0].status === 'present' ? 'default' : 'destructive', children: teacher.teacherAttendance[0].status === 'present' ? 'Mevcut' : 'Yok' })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-[#7A7A7A]", children: "Kay\u0131t yok" })) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-right", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleDeleteAssignment(assignment.id); }, className: "text-red-600 hover:bg-red-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) }) })] }, "".concat(teacher.id, "-").concat(assignment.id))); })); }) })] }) })] })] }) }));
}
