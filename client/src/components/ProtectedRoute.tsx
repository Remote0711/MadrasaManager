import { ReactNode } from "react";
import { Redirect } from "wouter";
import type { AuthUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  user?: AuthUser;
}

export default function ProtectedRoute({ children, allowedRoles, user }: ProtectedRouteProps) {
  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h1>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
