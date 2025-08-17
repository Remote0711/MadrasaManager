"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSidebar;
var jsx_runtime_1 = require("react/jsx-runtime");
var wouter_1 = require("wouter");
var wouter_2 = require("wouter");
var button_1 = require("@/components/ui/button");
var sheet_1 = require("@/components/ui/sheet");
var tr_1 = require("@/lib/tr");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var sidebarItems = [
    {
        name: tr_1.tr.dashboard,
        href: '/dashboard/admin',
        icon: lucide_react_1.Home,
    },
    {
        name: 'İstatistikler',
        href: '/dashboard/admin/statistics',
        icon: lucide_react_1.BarChart3,
    },
    {
        name: tr_1.tr.users,
        href: '/dashboard/admin/users',
        icon: lucide_react_1.Users,
    },
    {
        name: tr_1.tr.students,
        href: '/dashboard/admin/students',
        icon: lucide_react_1.GraduationCap,
    },
    {
        name: tr_1.tr.classes,
        href: '/dashboard/admin/classes',
        icon: lucide_react_1.BookOpen,
    },
    {
        name: tr_1.tr.lessonPlans,
        href: '/dashboard/admin/lesson-plans',
        icon: lucide_react_1.Calendar,
    },
    {
        name: tr_1.tr.teacherManagement,
        href: '/dashboard/admin/teacher-management',
        icon: lucide_react_1.BookOpen,
    },
    {
        name: tr_1.tr.studentRegistration,
        href: '/dashboard/admin/student-registration',
        icon: lucide_react_1.UserPlus,
    },
];
function SidebarContent(_a) {
    var onLinkClick = _a.onLinkClick, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse;
    var location = (0, wouter_1.useLocation)()[0];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-full flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between", children: [(0, jsx_runtime_1.jsxs)(wouter_2.Link, { href: "/dashboard/admin", className: "flex items-center gap-2 font-semibold min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 w-6 bg-primary rounded flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)("svg", { className: "h-3 w-3 text-white", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }) }) }), !isCollapsed && (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: tr_1.tr.schoolName })] }), onToggleCollapse && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onToggleCollapse, className: "hidden lg:flex h-8 w-8 p-0", children: isCollapsed ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("nav", { className: "grid items-start px-2 text-sm font-medium lg:px-4", children: sidebarItems.map(function (item) {
                        var Icon = item.icon;
                        var isActive = location === item.href;
                        return ((0, jsx_runtime_1.jsxs)(wouter_2.Link, { href: item.href, onClick: onLinkClick, className: "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ".concat(isActive
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground', " ").concat(isCollapsed ? 'justify-center' : ''), title: isCollapsed ? item.name : undefined, children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 flex-shrink-0" }), !isCollapsed && (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: item.name })] }, item.href));
                    }) }) })] }));
}
function AdminSidebar(_a) {
    var className = _a.className, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(sheet_1.Sheet, { open: open, onOpenChange: setOpen, children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "icon", className: "shrink-0 md:hidden", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Toggle navigation menu" })] }) }), (0, jsx_runtime_1.jsx)(sheet_1.SheetContent, { side: "left", className: "flex flex-col p-0", children: (0, jsx_runtime_1.jsx)(SidebarContent, { onLinkClick: function () { return setOpen(false); } }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "hidden border-r bg-muted/40 md:block ".concat(className, " ").concat(isCollapsed ? 'w-16' : 'w-64', " transition-all duration-300"), children: (0, jsx_runtime_1.jsx)(SidebarContent, { isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse }) })] }));
}
