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
exports.default = StudentRegistration;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var AdminLayout_1 = require("@/components/AdminLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var checkbox_1 = require("@/components/ui/checkbox");
var separator_1 = require("@/components/ui/separator");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
var studentRegistrationSchema = zod_2.z.object({
    firstName: zod_2.z.string().min(1, "Ad zorunludur"),
    lastName: zod_2.z.string().min(1, "Soyad zorunludur"),
    dateOfBirth: zod_2.z.string().optional(),
    parentId: zod_2.z.string().optional(),
    classId: zod_2.z.string().min(1, "Sınıf seçimi zorunludur"),
});
var parentSchema = zod_2.z.object({
    userId: zod_2.z.string().min(1, "Veli seçimi zorunludur"),
});
function StudentRegistration() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)([]), selectedSubjects = _c[0], setSelectedSubjects = _c[1];
    var _d = (0, react_1.useState)({}), subjectTeachers = _d[0], setSubjectTeachers = _d[1];
    var _e = (0, react_1.useState)(false), createParent = _e[0], setCreateParent = _e[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/classes'],
    }).data, classes = _f === void 0 ? [] : _f;
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/parents'],
    }).data, parents = _g === void 0 ? [] : _g;
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/teacher-assignments'],
    }).data, teachers = _h === void 0 ? [] : _h;
    var studentForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(studentRegistrationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            parentId: "",
            classId: "",
        },
    });
    var parentForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(parentSchema),
        defaultValues: {
            userId: "",
        },
    });
    var registerStudentMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/students/register", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/students'] });
            studentForm.reset();
            parentForm.reset();
            setSelectedSubjects([]);
            setSubjectTeachers({});
            setCreateParent(false);
            toast({ title: tr_1.tr.success, description: "Öğrenci başarıyla kaydedildi" });
        },
        onError: function () {
            toast({ title: tr_1.tr.error, description: "Öğrenci kaydedilirken hata oluştu", variant: "destructive" });
        },
    });
    var onSubmit = function (data) {
        var parentData = createParent ? parentForm.getValues() : undefined;
        var subjectEnrollments = selectedSubjects.map(function (subject) { return ({
            classId: data.classId,
            subject: subject,
            teacherId: subjectTeachers[subject] || undefined,
        }); });
        registerStudentMutation.mutate({
            studentData: data,
            subjectEnrollments: subjectEnrollments,
            parentData: parentData,
        });
    };
    var handleSubjectChange = function (subject, checked) {
        if (checked) {
            setSelectedSubjects(__spreadArray(__spreadArray([], selectedSubjects, true), [subject], false));
        }
        else {
            setSelectedSubjects(selectedSubjects.filter(function (s) { return s !== subject; }));
            var newTeachers = __assign({}, subjectTeachers);
            delete newTeachers[subject];
            setSubjectTeachers(newTeachers);
        }
    };
    var handleTeacherChange = function (subject, teacherId) {
        var _a;
        setSubjectTeachers(__assign(__assign({}, subjectTeachers), (_a = {}, _a[subject] = teacherId, _a)));
    };
    var getAvailableTeachers = function (subject) {
        return teachers.filter(function (teacher) {
            return teacher.teacherSubjectAssignments.some(function (assignment) {
                return assignment.subject === subject && assignment.classId === studentForm.watch('classId');
            });
        });
    };
    var getSubjectName = function (subject) {
        switch (subject) {
            case 'temel_bilgiler': return tr_1.tr.temelBilgiler;
            case 'kuran': return tr_1.tr.kuran;
            case 'ezber': return tr_1.tr.ezber;
            default: return subject;
        }
    };
    return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[#005C5C]", children: tr_1.tr.studentRegistration }), (0, jsx_runtime_1.jsx)("p", { className: "text-[#7A7A7A] mt-1", children: "Yeni \u00F6\u011Frenci kayd\u0131 olu\u015Fturun ve derslere kaydedin" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "lg:col-span-2 bg-white", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-[#005C5C] flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "w-5 h-5" }), "\u00D6\u011Frenci Bilgileri"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: studentForm.handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "firstName", children: tr_1.tr.firstName }), (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, studentForm.register("firstName"), { placeholder: tr_1.tr.firstNamePlaceholder, className: "border-[#E5E5E5] focus:border-[#005C5C]" })), studentForm.formState.errors.firstName && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: studentForm.formState.errors.firstName.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "lastName", children: tr_1.tr.lastName }), (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, studentForm.register("lastName"), { placeholder: tr_1.tr.lastNamePlaceholder, className: "border-[#E5E5E5] focus:border-[#005C5C]" })), studentForm.formState.errors.lastName && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: studentForm.formState.errors.lastName.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "dateOfBirth", children: tr_1.tr.dateOfBirth }), (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "date" }, studentForm.register("dateOfBirth"), { className: "border-[#E5E5E5] focus:border-[#005C5C]" }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "classId", children: tr_1.tr.class }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: studentForm.watch("classId"), onValueChange: function (value) { return studentForm.setValue("classId", value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "border-[#E5E5E5] focus:border-[#005C5C]", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: tr_1.tr.selectClass }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: classes.map(function (cls) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: cls.id, children: cls.name }, cls.id)); }) })] }), studentForm.formState.errors.classId && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: studentForm.formState.errors.classId.message }))] })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-[#005C5C] mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5" }), tr_1.tr.parentInformation] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "createParent", checked: createParent, onCheckedChange: setCreateParent }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "createParent", children: "Veli ba\u011Flant\u0131s\u0131 olu\u015Ftur" })] }), createParent && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "parentId", children: "Veli" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: parentForm.watch("userId"), onValueChange: function (value) { return parentForm.setValue("userId", value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "border-[#E5E5E5] focus:border-[#005C5C]", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Veli se\u00E7in" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: parents.map(function (parent) { return ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: parent.id, children: [parent.name, " (", parent.email, ")"] }, parent.id)); }) })] })] }))] })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-[#005C5C] mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-5 h-5" }), tr_1.tr.subjectEnrollment] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['temel_bilgiler', 'kuran', 'ezber'].map(function (subject) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 bg-[#FAF8F4]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-3", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: subject, checked: selectedSubjects.includes(subject), onCheckedChange: function (checked) { return handleSubjectChange(subject, checked); } }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: subject, className: "font-medium", children: getSubjectName(subject) })] }), selectedSubjects.includes(subject) && studentForm.watch('classId') && ((0, jsx_runtime_1.jsxs)("div", { className: "ml-6", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm", children: tr_1.tr.assignedTeacher }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: subjectTeachers[subject] || "", onValueChange: function (value) { return handleTeacherChange(subject, value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "border-[#E5E5E5] focus:border-[#005C5C]", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "\u00D6\u011Fretmen se\u00E7in (opsiyonel)" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: getAvailableTeachers(subject).map(function (teacher) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: teacher.id, children: teacher.name }, teacher.id)); }) })] })] }))] }, subject)); }) })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: registerStudentMutation.isPending, className: "w-full bg-[#005C5C] hover:bg-[#004A4A] text-white", children: registerStudentMutation.isPending ? tr_1.tr.loading : "Öğrenciyi Kaydet" })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-white", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-[#005C5C] flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5" }), "Kay\u0131t \u00D6zeti"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "\u00D6\u011Frenci Ad\u0131" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-medium", children: [studentForm.watch("firstName"), " ", studentForm.watch("lastName")] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: ((_a = classes.find(function (c) { return c.id === studentForm.watch("classId"); })) === null || _a === void 0 ? void 0 : _a.name) || "Seçilmedi" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Se\u00E7ilen Dersler" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1 mt-1", children: selectedSubjects.length > 0 ? (selectedSubjects.map(function (subject) {
                                                        var _a;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: getSubjectName(subject) }), subjectTeachers[subject] && ((0, jsx_runtime_1.jsxs)("span", { className: "text-[#7A7A7A] ml-2", children: ["- ", (_a = teachers.find(function (t) { return t.id === subjectTeachers[subject]; })) === null || _a === void 0 ? void 0 : _a.name] }))] }, subject));
                                                    })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Hen\u00FCz ders se\u00E7ilmedi" })) })] }), createParent && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[#7A7A7A]", children: "Veli" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: ((_b = parents.find(function (p) { return p.id === parentForm.watch("userId"); })) === null || _b === void 0 ? void 0 : _b.name) || "Seçilmedi" })] }))] })] })] })] }) }));
}
