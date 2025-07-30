import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/dashboard/admin";
import TeacherDashboard from "@/pages/dashboard/teacher";
import ParentDashboard from "@/pages/dashboard/parent";
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
      
      <Route path="/dashboard/admin">
        <ProtectedRoute allowedRoles={['ADMIN']} user={auth?.user}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/teacher">
        <ProtectedRoute allowedRoles={['TEACHER']} user={auth?.user}>
          <TeacherDashboard />
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
