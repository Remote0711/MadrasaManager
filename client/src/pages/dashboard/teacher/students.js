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
exports.default = TeacherStudents;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var TeacherLayout_1 = require("@/components/TeacherLayout");
var SubjectProgressForm_1 = require("@/components/SubjectProgressForm");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var dialog_1 = require("@/components/ui/dialog");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var tr_1 = require("@/lib/tr");
var queryClient_1 = require("@/lib/queryClient");
var use_toast_1 = require("@/hooks/use-toast");
var schema_1 = require("@shared/schema");
var updateStudentSchema = schema_1.insertStudentSchema.pick({
    firstName: true,
    lastName: true,
    dateOfBirth: true,
    classId: true,
});
function TeacherStudents() {
    var _this = this;
    var _a, _b, _c;
    var _d = (0, react_1.useState)(null), editingStudent = _d[0], setEditingStudent = _d[1];
    var _e = (0, react_1.useState)(false), editDialogOpen = _e[0], setEditDialogOpen = _e[1];
    var _f = (0, react_1.useState)(null), progressStudent = _f[0], setProgressStudent = _f[1];
    var _g = (0, react_1.useState)(false), progressDialogOpen = _g[0], setProgressDialogOpen = _g[1];
    var _h = (0, react_1.useState)(null), detailsStudent = _h[0], setDetailsStudent = _h[1];
    var _j = (0, react_1.useState)(false), detailsDialogOpen = _j[0], setDetailsDialogOpen = _j[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['/api/teacher/students'],
    }), students = _k.data, isLoading = _k.isLoading;
    var _l = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/classes'],
    }).data, classes = _l === void 0 ? [] : _l;
    var _m = (0, react_query_1.useQuery)({
        queryKey: ['/api/teacher/students', detailsStudent === null || detailsStudent === void 0 ? void 0 : detailsStudent.id],
        enabled: !!(detailsStudent === null || detailsStudent === void 0 ? void 0 : detailsStudent.id) && detailsDialogOpen,
    }), studentDetails = _m.data, isLoadingDetails = _m.isLoading;
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(updateStudentSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            classId: "",
        },
    });
    var updateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("PATCH", "/api/teacher/students/".concat(data.id), data)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Öğrenci güncellenirken hata oluştu");
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/teacher/students"] });
            toast({
                title: "Başarılı",
                description: "Öğrenci bilgileri başarıyla güncellendi",
            });
            setEditDialogOpen(false);
            setEditingStudent(null);
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Öğrenci güncellenirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var handleEdit = function (student) {
        setEditingStudent(student);
        form.reset({
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth || "",
            classId: student.classId,
        });
        setEditDialogOpen(true);
    };
    var openProgressDialog = function (student) {
        setProgressStudent(student);
        setProgressDialogOpen(true);
    };
    var handleDetails = function (student) {
        setDetailsStudent(student);
        setDetailsDialogOpen(true);
    };
    var getCurrentWeek = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    };
    var onSubmit = function (data) {
        if (!editingStudent)
            return;
        updateMutation.mutate(__assign(__assign({}, data), { id: editingStudent.id }));
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
    // Stable mock progress data using student ID as seed - in real app this would come from API
    var mockProgress = function (studentId) {
        var hash = 0;
        for (var i = 0; i < studentId.length; i++) {
            var char = studentId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        var progress = Math.abs(hash) % 100;
        return Math.max(20, progress);
    };
    return ((0, jsx_runtime_1.jsx)(TeacherLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 islamic-pattern" }), (0, jsx_runtime_1.jsx)("div", { className: "relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-xl border border-primary/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent", children: tr_1.tr.myStudents }), (0, jsx_runtime_1.jsxs)("p", { className: "text-muted-foreground mt-2 text-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-block w-1 h-4 bg-primary/60 mr-2 rounded" }), "\u00D6\u011Frencilerinizi takip edin ve de\u011Ferlendirin"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-primary", children: (students === null || students === void 0 ? void 0 : students.length) || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Toplam \u00D6\u011Frenci" })] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: students === null || students === void 0 ? void 0 : students.map(function (student) {
                        var _a, _b, _c;
                        var progress = mockProgress(student.id);
                        return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-primary" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold", children: [student.firstName, " ", student.lastName] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-muted-foreground flex items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-full bg-primary/60 mr-2" }), (_a = student.class) === null || _a === void 0 ? void 0 : _a.name] })] })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: "".concat(getProgressColor(progress), " px-3 py-1 text-sm font-semibold"), children: ["%", progress] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-2 h-4 w-4 text-primary" }), "Son hafta"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-primary font-semibold", children: [Math.abs(student.id.charCodeAt(0)) % 20 + 1, " sayfa"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Program:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-primary", children: (_c = (_b = student.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Kay\u0131t:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: new Date(student.enrollmentDate).toLocaleDateString('tr-TR') })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-2 pt-4 border-t border-primary/10", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleDetails(student); }, className: "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), "Detay"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleEdit(student); }, className: "border-secondary/50 text-secondary-foreground hover:bg-secondary/20", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "mr-1 h-3 w-3" }), "D\u00FCzenle"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return openProgressDialog(student); }, className: "border-accent/50 text-accent-foreground hover:bg-accent/20", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "mr-1 h-3 w-3" }), "\u0130lerleme"] })] })] }) })] }, student.id));
                    }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-primary" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xl font-semibold", children: ["\u00D6\u011Frenci Listesi (", (students === null || students === void 0 ? void 0 : students.length) || 0, ")"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Ad Soyad" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Program" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Kay\u0131t Tarihi" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "\u0130lerleme" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4", children: "\u0130\u015Flemler" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: students === null || students === void 0 ? void 0 : students.map(function (student) {
                                                var _a, _b, _c;
                                                var progress = mockProgress(student.id);
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-muted/50", children: [(0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 font-medium", children: [student.firstName, " ", student.lastName] }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-muted-foreground", children: ((_a = student.class) === null || _a === void 0 ? void 0 : _a.name) || 'Atanmamış' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: ((_c = (_b = student.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name) || 'Belirsiz' }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-muted-foreground", children: new Date(student.enrollmentDate).toLocaleDateString('tr-TR') }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: getProgressColor(progress), children: ["%", progress] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "\u0130\u015Flemleri a\u00E7" }), (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), "Detaylar\u0131 G\u00F6r\u00FCnt\u00FCle"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleEdit(student); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "mr-2 h-4 w-4" }), "Bilgileri D\u00FCzenle"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return openProgressDialog(student); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "mr-2 h-4 w-4" }), "Ders \u0130lerlemesi"] })] })] }) })] }, student.id));
                                            }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[500px]", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "\u00D6\u011Frenci Bilgilerini D\u00FCzenle" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "\u00D6\u011Frenci bilgilerini g\u00FCncelleyin. Sadece gerekli alanlar\u0131 de\u011Fi\u015Ftirin." })] }), (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "firstName", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, field, { placeholder: "\u00D6\u011Frencinin ad\u0131" })) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "lastName", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Soyad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, field, { placeholder: "\u00D6\u011Frencinin soyad\u0131" })) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "dateOfBirth", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Do\u011Fum Tarihi" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, field, { type: "date", value: field.value || '' })) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "classId", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "S\u0131n\u0131f se\u00E7in" }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: classes.map(function (classItem) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: classItem.id, children: classItem.name }, classItem.id)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setEditDialogOpen(false); }, children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: updateMutation.isPending, children: updateMutation.isPending ? "Güncelleniyor..." : "Güncelle" })] })] }) }))] }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: progressDialogOpen, onOpenChange: setProgressDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Ders \u0130lerlemesi Takibi" }) }), progressStudent && ((0, jsx_runtime_1.jsx)(SubjectProgressForm_1.default, { studentId: progressStudent.id, studentName: "".concat(progressStudent.firstName, " ").concat(progressStudent.lastName), week: getCurrentWeek(), plannedPages: { from: 1, to: 10 }, onSuccess: function () {
                                    setProgressDialogOpen(false);
                                    setProgressStudent(null);
                                    queryClient.invalidateQueries({ queryKey: ["/api/teacher/students"] });
                                } }))] }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: detailsDialogOpen, onOpenChange: setDetailsDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mr-2 h-5 w-5" }), detailsStudent && "".concat(detailsStudent.firstName, " ").concat(detailsStudent.lastName), " - Detayl\u0131 \u0130statistikler"] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "\u00D6\u011Frencinin t\u00FCm akademik ve davran\u0131\u015Fsal verilerinin kapsaml\u0131 g\u00F6r\u00FCn\u00FCm\u00FC" })] }), detailsStudent && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card border-l-4 border-l-primary", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-primary/5 to-secondary/5", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-4 w-4 text-primary" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold", children: "Temel Bilgiler" })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Ad Soyad" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold", children: [detailsStudent.firstName, " ", detailsStudent.lastName] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: (_a = detailsStudent.class) === null || _a === void 0 ? void 0 : _a.name })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Program T\u00FCr\u00FC" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: (_c = (_b = detailsStudent.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Kay\u0131t Tarihi" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: new Date(detailsStudent.enrollmentDate).toLocaleDateString('tr-TR') })] }), detailsStudent.dateOfBirth && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Do\u011Fum Tarihi" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: new Date(detailsStudent.dateOfBirth).toLocaleDateString('tr-TR') })] }))] }) })] }), ((studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.parent) || isLoadingDetails) && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card border-l-4 border-l-[#D4AF37]", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-[#D4AF37]/5 to-[#F5E6A3]/5", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-[#D4AF37]/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "h-4 w-4 text-[#D4AF37]" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold text-[#D4AF37]", children: "Veli \u0130leti\u015Fim Bilgileri" })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: isLoadingDetails ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" }) })) : (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.parent) ? ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Veli Ad\u0131" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold text-[#D4AF37]", children: [studentDetails.parent.user.firstName, " ", studentDetails.parent.user.lastName] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "\u0130li\u015Fki" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: studentDetails.parent.relationship })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "Telefon Numaras\u0131" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: (0, jsx_runtime_1.jsxs)("a", { href: "tel:".concat(studentDetails.parent.phoneNumber), className: "text-[#D4AF37] hover:underline flex items-center", children: ["\uD83D\uDCDE ", studentDetails.parent.phoneNumber] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-muted-foreground", children: "E-posta" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold", children: (0, jsx_runtime_1.jsxs)("a", { href: "mailto:".concat(studentDetails.parent.user.email), className: "text-[#D4AF37] hover:underline flex items-center", children: ["\u2709\uFE0F ", studentDetails.parent.user.email] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "col-span-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 pt-4 border-t border-[#D4AF37]/20", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { var _a; return window.open("tel:".concat((_a = studentDetails.parent) === null || _a === void 0 ? void 0 : _a.phoneNumber), '_self'); }, className: "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10", children: "\uD83D\uDCDE Arama Yap" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { var _a; return window.open("mailto:".concat((_a = studentDetails.parent) === null || _a === void 0 ? void 0 : _a.user.email), '_self'); }, className: "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10", children: "\u2709\uFE0F E-posta G\u00F6nder" })] }) })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserX, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground/50" }), (0, jsx_runtime_1.jsx)("p", { children: "Bu \u00F6\u011Frenci i\u00E7in veli bilgisi kay\u0131tl\u0131 de\u011Fil" })] })) })] })), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card border-l-4 border-l-primary", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-primary/5 to-secondary/5", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 text-primary" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold", children: "Devam \u0130statistikleri" })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "mx-auto h-8 w-8 text-green-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "85%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Devam Oran\u0131" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-red-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserX, { className: "mx-auto h-8 w-8 text-red-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: "3" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Devams\u0131zl\u0131k" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-yellow-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mx-auto h-8 w-8 text-yellow-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-600", children: "2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Mazeretli" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-2", children: "Son 5 Hafta Devam Durumu" }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-2", children: [
                                                                    { week: 'Hafta 1', status: 'present' },
                                                                    { week: 'Hafta 2', status: 'present' },
                                                                    { week: 'Hafta 3', status: 'absent' },
                                                                    { week: 'Hafta 4', status: 'present' },
                                                                    { week: 'Hafta 5', status: 'excused' }
                                                                ].map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground mb-1", children: item.week }), (0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 rounded text-xs font-medium ".concat(item.status === 'present' ? 'bg-green-100 text-green-800' :
                                                                                item.status === 'absent' ? 'bg-red-100 text-red-800' :
                                                                                    'bg-yellow-100 text-yellow-800'), children: item.status === 'present' ? 'Geldi' :
                                                                                item.status === 'absent' ? 'Gelmedi' : 'Mazeretli' })] }, index)); }) })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card border-l-4 border-l-primary", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-primary/5 to-secondary/5", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-primary" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold", children: "Akademik \u0130lerleme" })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "mx-auto h-8 w-8 text-blue-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "87%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Kur'an \u0130lerlemesi" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-purple-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mx-auto h-8 w-8 text-purple-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: "92%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Ezber Ba\u015Far\u0131s\u0131" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-orange-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mx-auto h-8 w-8 text-orange-600 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: "89%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Genel Ba\u015Far\u0131" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-2", children: "Haftal\u0131k \u0130lerleme" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [
                                                                        { subject: 'Kur\'an-ı Kerim', planned: 15, completed: 13, week: 'Bu hafta' },
                                                                        { subject: 'Ezber (Al-Fatiha)', planned: 7, completed: 7, week: 'Bu hafta' },
                                                                        { subject: 'Temel Bilgiler', planned: 10, completed: 8, week: 'Bu hafta' }
                                                                    ].map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: item.subject }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: item.week })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold", children: [item.completed, "/", item.planned] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-muted-foreground", children: ["%", Math.round((item.completed / item.planned) * 100)] })] })] }, index)); }) })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "islamic-card border-l-4 border-l-primary", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-gradient-to-r from-primary/5 to-secondary/5", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4 text-primary" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold", children: "Davran\u0131\u015F ve Notlar" })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "8.5/10" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Davran\u0131\u015F Puan\u0131" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "Dikkatli" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Genel Davran\u0131\u015F" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-2", children: "Son \u00D6\u011Fretmen Notlar\u0131" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [
                                                                        { date: '2025-01-29', note: 'Çok başarılı, aktif katılım gösterdi. Kur\'an okumada gelişim gösteriyor.' },
                                                                        { date: '2025-01-22', note: 'İyi çalışıyor, biraz daha odaklanabilir. Ezber konusunda gayet başarılı.' },
                                                                        { date: '2025-01-15', note: 'Mükemmel performans, tüm konularda başarılı. Arkadaşlarına yardımcı oluyor.' }
                                                                    ].map(function (item, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-50 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground mb-1", children: new Date(item.date).toLocaleDateString('tr-TR') }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: item.note })] }, index)); }) })] })] }) })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end mt-6", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: function () { return setDetailsDialogOpen(false); }, children: "Kapat" }) })] }) })] }) }));
}
