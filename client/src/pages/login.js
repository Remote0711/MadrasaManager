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
exports.default = Login;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var wouter_1 = require("wouter");
var react_query_1 = require("@tanstack/react-query");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var use_toast_1 = require("@/hooks/use-toast");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
var lucide_react_1 = require("lucide-react");
function Login() {
    var _this = this;
    var _a = (0, wouter_1.useLocation)(), setLocation = _a[1];
    var _b = (0, react_1.useState)(""), username = _b[0], setUsername = _b[1];
    var _c = (0, react_1.useState)(""), password = _c[0], setPassword = _c[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var loginMutation = (0, react_query_1.useMutation)({
        mutationFn: function (credentials) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/auth/login", credentials)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function (data) {
            queryClient.setQueryData(['/api/auth/me'], data);
            var role = data.user.role.toLowerCase();
            setLocation("/dashboard/".concat(role));
            toast({
                title: "Başarılı",
                description: "Giriş başarılı!",
            });
        },
        onError: function (error) {
            console.error("Login error:", error);
            toast({
                title: "Hata",
                description: "Geçersiz kullanıcı adı veya şifre",
                variant: "destructive",
            });
        },
    });
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!username || !password) {
            toast({
                title: tr_1.tr.error,
                description: tr_1.tr.fillAllFields,
                variant: "destructive",
            });
            return;
        }
        loginMutation.mutate({ username: username, password: password });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 islamic-pattern" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-20 left-20 w-32 h-32 opacity-5", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full h-full border-4 border-primary rotate-45 rounded-lg" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-20 right-20 w-24 h-24 opacity-5", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full h-full border-4 border-secondary rotate-12 rounded-full" }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full max-w-md islamic-card relative", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "text-center islamic-ornament", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto h-24 w-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6 shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-12 w-12 text-white" }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2", children: tr_1.tr.schoolName }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-lg", children: tr_1.tr.loginPrompt }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground arabic-text mt-2", children: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0627\u0644\u0631\u064E\u0651\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u064E\u0651\u062D\u0650\u064A\u0645\u0650" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "username", className: "block text-sm font-medium text-gray-700 mb-1", children: "Kullan\u0131c\u0131 Ad\u0131" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "username", type: "text", required: true, value: username, onChange: function (e) { return setUsername(e.target.value); }, className: "w-full", placeholder: "Kullan\u0131c\u0131 ad\u0131n\u0131z\u0131 girin" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: tr_1.tr.password }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", type: "password", required: true, value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "w-full", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full islamic-button h-12 text-lg font-semibold", disabled: loginMutation.isPending, children: loginMutation.isPending ? tr_1.tr.loggingIn : tr_1.tr.login })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 text-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-primary mb-2", children: tr_1.tr.demoCredentials }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Admin:" }), " admin / 123456"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "\u00D6\u011Fretmen:" }), " ogretmen / 123456"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Veli:" }), " veli / 123456"] })] })] })] })] })] }));
}
