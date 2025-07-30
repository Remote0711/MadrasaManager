import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/dashboard/admin";
import UsersPage from "@/pages/dashboard/admin/users";
import AdminStudents from "@/pages/dashboard/admin/students";
import AdminClasses from "@/pages/dashboard/admin/classes";
import AdminLessonPlans from "@/pages/dashboard/admin/lesson-plans";
import StudentProfile from "@/pages/dashboard/admin/student-profile";
import TeacherDashboard from "@/pages/dashboard/teacher";
import TeacherStudents from "@/pages/dashboard/teacher/students";
import TeacherAttendance from "@/pages/dashboard/teacher/attendance";
import TeacherProgress from "@/pages/dashboard/teacher/progress";
import ParentDashboard from "@/pages/dashboard/parent";
import ParentProgress from "@/pages/dashboard/parent/progress";
import ParentAttendance from "@/pages/dashboard/parent/attendance";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { AuthUser } from "@/lib/auth";

function AppContent() {
  const { data: auth, isLoading } = useQuery<{ user: AuthUser } | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {auth?.user ? <Redirect to={`/dashboard/${auth.user.role.toLowerCase()}`} /> : <Login />}
      </Route>
      
      <Route path="/dashboard/admin/users">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <UsersPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/admin/students/:id">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <StudentProfile />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/admin/students">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <AdminStudents />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/admin/classes">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <AdminClasses />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/admin/lesson-plans">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <AdminLessonPlans />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/admin">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/teacher/students">
        <ProtectedRoute allowedRoles={['TEACHER']} user={auth?.user}>
          <TeacherStudents />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/teacher/attendance">
        <ProtectedRoute allowedRoles={['TEACHER']} user={auth?.user}>
          <TeacherAttendance />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/teacher/progress">
        <ProtectedRoute allowedRoles={['TEACHER']} user={auth?.user}>
          <TeacherProgress />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/teacher">
        <ProtectedRoute allowedRoles={['TEACHER']} user={auth?.user}>
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/parent/progress">
        <ProtectedRoute allowedRoles={['PARENT']} user={auth?.user}>
          <ParentProgress />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/parent/attendance">
        <ProtectedRoute allowedRoles={['PARENT']} user={auth?.user}>
          <ParentAttendance />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/parent">
        <ProtectedRoute allowedRoles={['PARENT']} user={auth?.user}>
          <ParentDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        {auth?.user ? 
          <Redirect to={`/dashboard/${auth.user.role.toLowerCase()}`} /> : 
          <Redirect to="/login" />
        }
      </Route>
      
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Sayfa Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız sayfa mevcut değil.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
