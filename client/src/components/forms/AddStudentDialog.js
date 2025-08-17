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
exports.default = AddStudentDialog;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var queryClient_1 = require("@/lib/queryClient");
var use_toast_1 = require("@/hooks/use-toast");
var schema_1 = require("@shared/schema");
var studentFormSchema = schema_1.insertStudentSchema.extend({
    dateOfBirth: zod_2.z.string().optional(),
    parentId: zod_2.z.string().optional(),
});
function AddStudentDialog() {
    var _this = this;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch classes and parents
    var classes = (0, react_query_1.useQuery)({
        queryKey: ["/api/admin/classes"],
    }).data;
    var parents = (0, react_query_1.useQuery)({
        queryKey: ["/api/admin/parents"],
    }).data;
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(studentFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            classId: "",
            parentId: "",
        },
    });
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = __assign(__assign({}, data), { dateOfBirth: data.dateOfBirth || undefined });
                        return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/students", payload)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Öğrenci eklenirken hata oluştu");
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
            queryClient.invalidateQueries({ queryKey: ["/api/teacher/students"] });
            toast({
                title: "Başarılı",
                description: "Yeni öğrenci başarıyla eklendi",
            });
            form.reset();
            setOpen(false);
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Öğrenci eklenirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var onSubmit = function (data) {
        mutation.mutate(data);
    };
    return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full justify-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GraduationCap, { className: "mr-2 h-4 w-4" }), "\u00D6\u011Frenci Kaydet"] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[425px]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Yeni \u00D6\u011Frenci Ekle" }) }), (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "firstName", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "\u00D6\u011Frenci ad\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "lastName", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Soyad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "\u00D6\u011Frenci soyad\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "dateOfBirth", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Do\u011Fum Tarihi" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "date" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "classId", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "S\u0131n\u0131f" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "S\u0131n\u0131f se\u00E7in" }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: classes === null || classes === void 0 ? void 0 : classes.map(function (classItem) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: classItem.id, children: classItem.name }, classItem.id)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "parentId", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Veli (Opsiyonel)" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Veli se\u00E7in" }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: parents === null || parents === void 0 ? void 0 : parents.map(function (parent) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: parent.id, children: parent.name }, parent.id)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setOpen(false); }, disabled: mutation.isPending, children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Kaydediliyor..." : "Kaydet" })] })] }) }))] })] }));
}
