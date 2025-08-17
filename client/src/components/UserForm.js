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
exports.default = UserForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var dialog_1 = require("@/components/ui/dialog");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
var lucide_react_1 = require("lucide-react");
function UserForm(_a) {
    var _this = this;
    var onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_1.useState)(""), name = _c[0], setName = _c[1];
    var _d = (0, react_1.useState)(""), email = _d[0], setEmail = _d[1];
    var _e = (0, react_1.useState)(""), password = _e[0], setPassword = _e[1];
    var _f = (0, react_1.useState)("TEACHER"), role = _f[0], setRole = _f[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var createUserMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/admin/users", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: tr_1.tr.success,
                description: tr_1.tr.userCreated,
            });
            setOpen(false);
            setName("");
            setEmail("");
            setPassword("");
            setRole("TEACHER");
            queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        },
        onError: function () {
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.userCreateError,
                variant: "destructive",
            });
        },
    });
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!name || !email || !password || !role) {
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.fillAllFields,
                variant: "destructive",
            });
            return;
        }
        createUserMutation.mutate({ name: name, email: email, password: password, role: role });
    };
    return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }), tr_1.tr.addNewUser] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "sm:max-w-md", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: tr_1.tr.addNewUser }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: tr_1.tr.fullName }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "name", value: name, onChange: function (e) { return setName(e.target.value); }, placeholder: tr_1.tr.fullNamePlaceholder, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: tr_1.tr.email }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, placeholder: tr_1.tr.emailPlaceholder, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: tr_1.tr.password }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "block text-sm font-medium text-gray-700 mb-1", children: tr_1.tr.role }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: role, onValueChange: function (value) { return setRole(value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ADMIN", children: tr_1.tr.roles.admin }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "TEACHER", children: tr_1.tr.roles.teacher }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "PARENT", children: tr_1.tr.roles.parent })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2 pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setOpen(false); }, children: tr_1.tr.cancel }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: createUserMutation.isPending, children: createUserMutation.isPending ? tr_1.tr.saving : tr_1.tr.save })] })] })] })] }));
}
