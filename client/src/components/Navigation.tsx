import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { AuthUser } from "@/lib/auth";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

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

  if (!auth?.user) return null;

  const { user } = auth;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { name: tr.dashboard, href: '/dashboard/admin', icon: '📊' },
          { name: tr.users, href: '/dashboard/admin/users', icon: '👥' },
          { name: tr.students, href: '/dashboard/admin/students', icon: '🎓' },
          { name: tr.classes, href: '/dashboard/admin/classes', icon: '📚' },
          { name: tr.lessonPlans, href: '/dashboard/admin/lesson-plans', icon: '📖' },
        ];
      case 'TEACHER':
        return [
          { name: tr.dashboard, href: '/dashboard/teacher', icon: '📊' },
          { name: tr.myStudents, href: '/dashboard/teacher/students', icon: '🎓' },
          { name: tr.attendance, href: '/dashboard/teacher/attendance', icon: '✅' },
          { name: tr.progress, href: '/dashboard/teacher/progress', icon: '📈' },
        ];
      case 'PARENT':
        return [
          { name: tr.home, href: '/dashboard/parent', icon: '🏠' },
          { name: tr.progress, href: '/dashboard/parent/progress', icon: '📈' },
          { name: tr.attendance, href: '/dashboard/parent/attendance', icon: '✅' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                {tr.schoolName}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {getNavigationItems().map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <span className="text-gray-700 text-sm font-medium mr-4">
              {user.name} ({tr.roles[user.role.toLowerCase() as keyof typeof tr.roles]})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
