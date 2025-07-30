import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { AuthUser } from "@/lib/auth";
import TeacherSidebar from "./TeacherSidebar";
import { LogOut } from "lucide-react";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: auth } = useQuery<{ user: AuthUser } | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      setLocation("/login");
    },
  });

  if (!auth?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { user } = auth;

  return (
    <div className={`grid min-h-screen w-full ${sidebarCollapsed ? 'md:grid-cols-[64px_1fr]' : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'}`}>
      <TeacherSidebar 
        className="hidden md:block" 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 px-4 lg:h-[70px] lg:px-6 islamic-ornament">
          <TeacherSidebar className="md:hidden" />
          
          <div className="w-full flex-1">
            <h1 className="text-xl font-bold md:text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {tr.teacherDashboard}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-primary">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {tr.roles[user.role.toLowerCase() as keyof typeof tr.roles]}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="islamic-button h-10 w-10 rounded-full"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">{tr.logout}</span>
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 relative">
          <div className="absolute inset-0 islamic-pattern pointer-events-none"></div>
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}