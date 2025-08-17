"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var wouter_1 = require("wouter");
var queryClient_1 = require("./lib/queryClient");
var react_query_1 = require("@tanstack/react-query");
var toaster_1 = require("@/components/ui/toaster");
var tooltip_1 = require("@/components/ui/tooltip");
var react_query_2 = require("@tanstack/react-query");
var login_1 = require("@/pages/login");
var admin_1 = require("@/pages/dashboard/admin");
var users_1 = require("@/pages/dashboard/admin/users");
var students_1 = require("@/pages/dashboard/admin/students");
var classes_1 = require("@/pages/dashboard/admin/classes");
var lesson_plans_1 = require("@/pages/dashboard/admin/lesson-plans");
var statistics_1 = require("@/pages/dashboard/admin/statistics");
var teacher_management_1 = require("@/pages/dashboard/admin/teacher-management");
var student_registration_1 = require("@/pages/dashboard/admin/student-registration");
var student_profile_1 = require("@/pages/dashboard/admin/student-profile");
var teacher_1 = require("@/pages/dashboard/teacher");
var students_2 = require("@/pages/dashboard/teacher/students");
var attendance_1 = require("@/pages/dashboard/teacher/attendance");
var progress_1 = require("@/pages/dashboard/teacher/progress");
var parent_1 = require("@/pages/dashboard/parent");
var progress_2 = require("@/pages/dashboard/parent/progress");
var attendance_2 = require("@/pages/dashboard/parent/attendance");
var ProtectedRoute_1 = require("@/components/ProtectedRoute");
function AppContent() {
    var _a = (0, react_query_2.useQuery)({
        queryKey: ['/api/auth/me'],
        retry: false,
    }), auth = _a.data, isLoading = _a.isLoading;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Y\u00FCkleniyor..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(wouter_1.Switch, { children: [(0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/login", children: (auth === null || auth === void 0 ? void 0 : auth.user) ? (0, jsx_runtime_1.jsx)(wouter_1.Redirect, { to: "/dashboard/".concat(auth.user.role.toLowerCase()) }) : (0, jsx_runtime_1.jsx)(login_1.default, {}) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/users", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(users_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/students/:id", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(student_profile_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/students", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(students_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/classes", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(classes_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/lesson-plans", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(lesson_plans_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/statistics", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(statistics_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/teacher-management", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(teacher_management_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin/student-registration", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(student_registration_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/admin", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['ADMIN'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(admin_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/teacher/students", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['TEACHER'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(students_2.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/teacher/attendance", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['TEACHER'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(attendance_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/teacher/progress", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['TEACHER'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(progress_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/teacher", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['TEACHER'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(teacher_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/parent/progress", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['PARENT'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(progress_2.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/parent/attendance", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['PARENT'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(attendance_2.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/dashboard/parent", children: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { allowedRoles: ['PARENT'], user: auth === null || auth === void 0 ? void 0 : auth.user, children: (0, jsx_runtime_1.jsx)(parent_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { path: "/", children: (auth === null || auth === void 0 ? void 0 : auth.user) ?
                    (0, jsx_runtime_1.jsx)(wouter_1.Redirect, { to: "/dashboard/".concat(auth.user.role.toLowerCase()) }) :
                    (0, jsx_runtime_1.jsx)(wouter_1.Redirect, { to: "/login" }) }), (0, jsx_runtime_1.jsx)(wouter_1.Route, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "404 - Sayfa Bulunamad\u0131" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Arad\u0131\u011F\u0131n\u0131z sayfa mevcut de\u011Fil." })] }) }) })] }));
}
function App() {
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient_1.queryClient, children: (0, jsx_runtime_1.jsxs)(tooltip_1.TooltipProvider, { children: [(0, jsx_runtime_1.jsx)(toaster_1.Toaster, {}), (0, jsx_runtime_1.jsx)(AppContent, {})] }) }));
}
exports.default = App;
