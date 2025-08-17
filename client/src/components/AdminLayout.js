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
exports.default = AdminLayout;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var wouter_1 = require("wouter");
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
var AdminSidebar_1 = require("./AdminSidebar");
var lucide_react_1 = require("lucide-react");
function AdminLayout(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, wouter_1.useLocation)(), setLocation = _b[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_1.useState)(false), sidebarCollapsed = _c[0], setSidebarCollapsed = _c[1];
    var auth = (0, react_query_1.useQuery)({
        queryKey: ['/api/auth/me'],
        retry: false,
    }).data;
    var logoutMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/auth/logout", {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.setQueryData(['/api/auth/me'], null);
            setLocation("/login");
        },
    });
    if (!(auth === null || auth === void 0 ? void 0 : auth.user)) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
    }
    var user = auth.user;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "grid min-h-screen w-full ".concat(sidebarCollapsed ? 'md:grid-cols-[64px_1fr]' : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'), children: [(0, jsx_runtime_1.jsx)(AdminSidebar_1.default, { className: "hidden md:block", isCollapsed: sidebarCollapsed, onToggleCollapse: function () { return setSidebarCollapsed(!sidebarCollapsed); } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("header", { className: "flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6", children: [(0, jsx_runtime_1.jsx)(AdminSidebar_1.default, { className: "md:hidden" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full flex-1", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-lg font-semibold md:text-2xl", children: tr_1.tr.adminPanel }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-muted-foreground", children: [user.name, " (", tr_1.tr.roles[user.role.toLowerCase()], ")"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return logoutMutation.mutate(); }, disabled: logoutMutation.isPending, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: tr_1.tr.logout })] })] })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6", children: children })] })] }));
}
