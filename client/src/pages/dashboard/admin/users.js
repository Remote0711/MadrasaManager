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
exports.default = UsersPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var AdminLayout_1 = require("@/components/AdminLayout");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var dialog_1 = require("@/components/ui/dialog");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var queryClient_1 = require("@/lib/queryClient");
var use_toast_1 = require("@/hooks/use-toast");
var updateUserSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, "Ad soyad gereklidir"),
    username: zod_2.z.string().min(1, "Kullanıcı adı gereklidir"),
    email: zod_2.z.string().email("Geçerli bir email adresi giriniz").optional().or(zod_2.z.literal("")),
    phone: zod_2.z.string().optional(),
    role: zod_2.z.enum(["ADMIN", "TEACHER", "PARENT"]),
});
function UsersPage() {
    var _this = this;
    var _a = (0, react_1.useState)(null), editingUser = _a[0], setEditingUser = _a[1];
    var _b = (0, react_1.useState)(false), editDialogOpen = _b[0], setEditDialogOpen = _b[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_query_1.useQuery)({
        queryKey: ["/api/admin/users"],
    }), _d = _c.data, users = _d === void 0 ? [] : _d, isLoading = _c.isLoading;
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(updateUserSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            phone: "",
            role: "TEACHER",
        },
    });
    var updateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("PATCH", "/api/admin/users/".concat(data.id), data)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Kullanıcı güncellenirken hata oluştu");
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({
                title: "Başarılı",
                description: "Kullanıcı bilgileri başarıyla güncellendi",
            });
            setEditDialogOpen(false);
            setEditingUser(null);
            form.reset();
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Kullanıcı güncellenirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var handleEdit = function (user) {
        setEditingUser(user);
        form.reset({
            name: user.name,
            username: user.username,
            email: user.email || "",
            phone: user.phone || "",
            role: user.role,
        });
        setEditDialogOpen(true);
    };
    var onSubmit = function (data) {
        if (!editingUser)
            return;
        var updateData = __assign(__assign({}, data), { id: editingUser.id, email: data.email === "" ? undefined : data.email, phone: data.phone === "" ? undefined : data.phone });
        updateMutation.mutate(updateData);
    };
    var getRoleBadgeVariant = function (role) {
        switch (role) {
            case "ADMIN":
                return "destructive";
            case "TEACHER":
                return "default";
            case "PARENT":
                return "secondary";
            default:
                return "outline";
        }
    };
    var getRoleText = function (role) {
        switch (role) {
            case "ADMIN":
                return "Yönetici";
            case "TEACHER":
                return "Öğretmen";
            case "PARENT":
                return "Veli";
            default:
                return role;
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(AdminLayout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between items-center", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Kullan\u0131c\u0131 Y\u00F6netimi" }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5" }), "T\u00FCm Kullan\u0131c\u0131lar (", users.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "rounded-md border", children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Ad Soyad" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Kullan\u0131c\u0131 Ad\u0131" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Email" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Telefon" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Rol" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "\u0130\u015Flemler" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: users.map(function (user) { return ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "font-medium", children: user.name }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: user.username }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: user.email ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4 text-gray-400" }), user.email] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Belirtilmemi\u015F" })) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: user.phone ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4 text-gray-400" }), user.phone] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Belirtilmemi\u015F" })) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getRoleBadgeVariant(user.role), children: getRoleText(user.role) }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return handleEdit(user); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-1" }), "D\u00FCzenle"] }) })] }, user.id)); }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[500px]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Kullan\u0131c\u0131 Bilgilerini D\u00FCzenle" }) }), (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "name", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ad Soyad" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "Ad Soyad" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "username", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Kullan\u0131c\u0131 Ad\u0131" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "Kullan\u0131c\u0131 ad\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "email", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Email Adresi" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "email", placeholder: "email@ornek.com" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "phone", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Telefon Numaras\u0131" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "+90 555 123 45 67" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "role", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Rol" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Rol se\u00E7in" }) }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ADMIN", children: "Y\u00F6netici" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "TEACHER", children: "\u00D6\u011Fretmen" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "PARENT", children: "Veli" })] })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setEditDialogOpen(false); }, disabled: updateMutation.isPending, children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: updateMutation.isPending, children: updateMutation.isPending ? "Güncelleniyor..." : "Güncelle" })] })] }) }))] }) })] }) }));
}
