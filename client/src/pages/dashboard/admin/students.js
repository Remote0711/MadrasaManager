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
exports.default = AdminStudents;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var wouter_1 = require("wouter");
var AdminLayout_1 = require("@/components/AdminLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var dialog_1 = require("@/components/ui/dialog");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var AddStudentDialog_1 = require("@/components/forms/AddStudentDialog");
var updateStudentSchema = zod_2.z.object({
    firstName: zod_2.z.string().min(1, "Ad gereklidir"),
    lastName: zod_2.z.string().min(1, "Soyad gereklidir"),
    dateOfBirth: zod_2.z.string().optional(),
    classId: zod_2.z.string().min(1, "Sınıf seçilmelidir"),
});
function AdminStudents() {
    var _this = this;
    var _a = (0, react_1.useState)(null), editingStudent = _a[0], setEditingStudent = _a[1];
    var _b = (0, react_1.useState)(false), editDialogOpen = _b[0], setEditDialogOpen = _b[1];
    var _c = (0, react_1.useState)(false), deleteDialogOpen = _c[0], setDeleteDialogOpen = _c[1];
    var _d = (0, react_1.useState)(null), studentToDelete = _d[0], setStudentToDelete = _d[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var location = (0, wouter_1.useLocation)()[0];
    // Get classId from URL parameters using window.location for query string
    var urlParams = new URLSearchParams(window.location.search);
    var classIdFilter = urlParams.get('classId');
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/students'],
    }), allStudents = _e.data, isLoading = _e.isLoading;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['/api/admin/classes'],
    }).data, classes = _f === void 0 ? [] : _f;
    // Filter students based on classId parameter
    var students = (0, react_1.useMemo)(function () {
        if (!allStudents)
            return [];
        if (!classIdFilter)
            return allStudents;
        return allStudents.filter(function (student) { return student.classId === classIdFilter; });
    }, [allStudents, classIdFilter]);
    // Get class name for display
    var selectedClass = (0, react_1.useMemo)(function () {
        if (!classIdFilter || !classes)
            return null;
        return classes.find(function (cls) { return cls.id === classIdFilter; });
    }, [classIdFilter, classes]);
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
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("PATCH", "/api/admin/students/".concat(data.id), data)];
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
            queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
            toast({
                title: "Başarılı",
                description: "Öğrenci bilgileri başarıyla güncellendi",
            });
            setEditDialogOpen(false);
            setEditingStudent(null);
            form.reset();
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Öğrenci güncellenirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("DELETE", "/api/admin/students/".concat(id))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Öğrenci silinirken hata oluştu");
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
            toast({
                title: "Başarılı",
                description: "Öğrenci başarıyla silindi",
            });
            setDeleteDialogOpen(false);
            setStudentToDelete(null);
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Öğrenci silinirken hata oluştu",
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
    var handleDelete = function (student) {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
    };
    var onSubmit = function (data) {
        if (!editingStudent)
            return;
        var updateData = __assign(__assign({}, data), { id: editingStudent.id, dateOfBirth: data.dateOfBirth === "" ? undefined : data.dateOfBirth });
        updateMutation.mutate(updateData);
    };
    var confirmDelete = function () {
        if (!studentToDelete)
            return;
        deleteMutation.mutate(studentToDelete.id);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: selectedClass ? "".concat(selectedClass.name, " - \u00D6\u011Frenciler") : tr_1.tr.students }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: selectedClass
                                        ? "".concat(selectedClass.name, " s\u0131n\u0131f\u0131ndaki ").concat((students === null || students === void 0 ? void 0 : students.length) || 0, " \u00F6\u011Frenci")
                                        : "Öğrenci kayıtlarını yönetin" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [selectedClass && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return window.history.back(); }, children: "Geri D\u00F6n" })), (0, jsx_runtime_1.jsx)(AddStudentDialog_1.default, {})] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GraduationCap, { className: "mr-2 h-5 w-5" }), "\u00D6\u011Frenci Listesi (", (students === null || students === void 0 ? void 0 : students.length) || 0, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Ad Soyad" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Program" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Kay\u0131t Tarihi" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4", children: "Durum" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4", children: "\u0130\u015Flemler" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: students === null || students === void 0 ? void 0 : students.map(function (student) {
                                                var _a, _b, _c;
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-muted/50", children: [(0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 font-medium", children: [student.firstName, " ", student.lastName] }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-muted-foreground", children: ((_a = student.class) === null || _a === void 0 ? void 0 : _a.name) || 'Atanmamış' }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: ((_c = (_b = student.class) === null || _b === void 0 ? void 0 : _b.programType) === null || _c === void 0 ? void 0 : _c.name) || 'Belirsiz' }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-muted-foreground", children: new Date(student.enrollmentDate).toLocaleDateString('tr-TR') }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-green-600 border-green-600", children: "Aktif" }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right", children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "\u0130\u015Flemleri a\u00E7" }), (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), "G\u00F6r\u00FCnt\u00FCle"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleEdit(student); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "mr-2 h-4 w-4" }), "D\u00FCzenle"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { className: "text-red-600", onClick: function () { return handleDelete(student); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }), "Sil"] })] })] }) })] }, student.id));
                                            }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[500px]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "\u00D6\u011Frenci Bilgilerini D\u00FCzenle" }) }), (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "firstName", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "lastName", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Soyad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({}, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "dateOfBirth", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Do\u011Fum Tarihi" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "date" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "classId", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "S\u0131n\u0131f se\u00E7in" }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: classes.map(function (cls) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: cls.id, children: cls.name }, cls.id)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setEditDialogOpen(false); }, children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: updateMutation.isPending, children: updateMutation.isPending ? "Güncelleniyor..." : "Güncelle" })] })] }) }))] }) }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: "\u00D6\u011Frenciyi Sil" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: studentToDelete && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("strong", { children: [studentToDelete.firstName, " ", studentToDelete.lastName] }), " adl\u0131 \u00F6\u011Frenciyi silmek istedi\u011Finizden emin misiniz? Bu i\u015Flem geri al\u0131namaz ve \u00F6\u011Frenciye ait t\u00FCm veriler (devams\u0131zl\u0131k, ilerleme kay\u0131tlar\u0131 vb.) silinecektir."] })) })] }), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700", disabled: deleteMutation.isPending, children: deleteMutation.isPending ? "Siliniyor..." : "Sil" })] })] }) })] }) }));
}
