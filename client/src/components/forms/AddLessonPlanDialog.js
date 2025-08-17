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
exports.default = AddLessonPlanDialog;
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
var lessonPlanFormSchema = schema_1.insertLessonPlanSchema.extend({
    pagesFrom: zod_2.z.coerce.number().min(1, "Başlangıç sayfası en az 1 olmalıdır"),
    pagesTo: zod_2.z.coerce.number().min(1, "Bitiş sayfası en az 1 olmalıdır"),
    week: zod_2.z.coerce.number().min(1, "Hafta en az 1 olmalıdır").max(52, "Hafta en fazla 52 olabilir"),
    classLevel: zod_2.z.coerce.number().min(1, "Sınıf seviyesi en az 1 olmalıdır").max(5, "Sınıf seviyesi en fazla 5 olabilir"),
});
function AddLessonPlanDialog() {
    var _this = this;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    // Fetch program types for the dropdown
    var _b = (0, react_query_1.useQuery)({
        queryKey: ["/api/admin/program-types"],
    }).data, programTypes = _b === void 0 ? [] : _b;
    var form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(lessonPlanFormSchema),
        defaultValues: {
            week: 1,
            subject: "",
            pagesFrom: 1,
            pagesTo: 10,
            classLevel: 1,
            programTypeId: "",
        },
    });
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/lesson-plans", data)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Ders planı eklenirken hata oluştu");
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/lesson-plans"] });
            toast({
                title: "Başarılı",
                description: "Yeni ders planı başarıyla oluşturuldu",
            });
            form.reset();
            setOpen(false);
        },
        onError: function (error) {
            toast({
                title: "Hata",
                description: error.message || "Ders planı oluşturulurken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var onSubmit = function (data) {
        if (data.pagesFrom >= data.pagesTo) {
            toast({
                title: "Hata",
                description: "Bitiş sayfası başlangıç sayfasından büyük olmalıdır",
                variant: "destructive",
            });
            return;
        }
        mutation.mutate(data);
    };
    return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full justify-start", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "mr-2 h-4 w-4" }), "Ders Plan\u0131 Olu\u015Ftur"] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-[500px]", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Yeni Ders Plan\u0131 Olu\u015Ftur" }) }), (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, form, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "week", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Hafta" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: "Hafta numaras\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "classLevel", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "S\u0131n\u0131f Seviyesi" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: "S\u0131n\u0131f seviyesi" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "subject", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ders Konusu" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ placeholder: "Ders konusu (\u00F6rn: Kur'an-\u0131 Kerim, F\u0131k\u0131h)" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "pagesFrom", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Ba\u015Flang\u0131\u00E7 Sayfas\u0131" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: "Ba\u015Flang\u0131\u00E7 sayfas\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "pagesTo", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Biti\u015F Sayfas\u0131" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: "Biti\u015F sayfas\u0131" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "programTypeId", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Program T\u00FCr\u00FC" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Program t\u00FCr\u00FC se\u00E7in" }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: programTypes.map(function (programType) { return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: programType.id, children: programType.name }, programType.id)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                    } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setOpen(false); }, disabled: mutation.isPending, children: "\u0130ptal" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Oluşturuluyor..." : "Ders Planı Oluştur" })] })] }) }))] })] }));
}
