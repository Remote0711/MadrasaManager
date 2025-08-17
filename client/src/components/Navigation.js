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
exports.default = Navigation;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var wouter_1 = require("wouter");
var button_1 = require("@/components/ui/button");
var queryClient_1 = require("@/lib/queryClient");
var tr_1 = require("@/lib/tr");
function Navigation() {
    var _this = this;
    var _a = (0, wouter_1.useLocation)(), setLocation = _a[1];
    var queryClient = (0, react_query_1.useQueryClient)();
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
    if (!(auth === null || auth === void 0 ? void 0 : auth.user))
        return null;
    var user = auth.user;
    var getNavigationItems = function () {
        switch (user.role) {
            case 'ADMIN':
                return [
                    { name: tr_1.tr.dashboard, href: '/dashboard/admin', icon: '📊' },
                    { name: tr_1.tr.users, href: '/dashboard/admin/users', icon: '👥' },
                    { name: tr_1.tr.students, href: '/dashboard/admin/students', icon: '🎓' },
                    { name: tr_1.tr.classes, href: '/dashboard/admin/classes', icon: '📚' },
                    { name: tr_1.tr.lessonPlans, href: '/dashboard/admin/lesson-plans', icon: '📖' },
                ];
            case 'TEACHER':
                return [
                    { name: tr_1.tr.dashboard, href: '/dashboard/teacher', icon: '📊' },
                    { name: tr_1.tr.myStudents, href: '/dashboard/teacher/students', icon: '🎓' },
                    { name: tr_1.tr.attendance, href: '/dashboard/teacher/attendance', icon: '✅' },
                    { name: tr_1.tr.progress, href: '/dashboard/teacher/progress', icon: '📈' },
                ];
            case 'PARENT':
                return [
                    { name: tr_1.tr.home, href: '/dashboard/parent', icon: '🏠' },
                    { name: tr_1.tr.progress, href: '/dashboard/parent/progress', icon: '📈' },
                    { name: tr_1.tr.attendance, href: '/dashboard/parent/attendance', icon: '✅' },
                ];
            default:
                return [];
        }
    };
    return ((0, jsx_runtime_1.jsx)("nav", { className: "bg-white shadow-sm border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between h-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-shrink-0 flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8 bg-primary rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "h-4 w-4 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }) }) }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xl font-semibold text-gray-900", children: tr_1.tr.schoolName })] }), (0, jsx_runtime_1.jsx)("div", { className: "hidden sm:ml-8 sm:flex sm:space-x-8", children: getNavigationItems().map(function (item) { return ((0, jsx_runtime_1.jsxs)("a", { href: item.href, className: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: item.icon }), item.name] }, item.name)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-700 text-sm font-medium mr-4", children: [user.name, " (", tr_1.tr.roles[user.role.toLowerCase()], ")"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return logoutMutation.mutate(); }, disabled: logoutMutation.isPending, children: (0, jsx_runtime_1.jsx)("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }) })] })] }) }) }));
}
