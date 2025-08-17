import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import { BookOpen } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data);
      const role = data.user.role.toLowerCase();
      setLocation(`/dashboard/${role}`);
      toast({
        title: "Başarılı",
        description: "Giriş başarılı!",
      });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Hata",
        description: "Geçersiz kullanıcı adı veya şifre",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: tr.error,
        description: tr.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-teal-50 relative">
      
      <Card className="w-full max-w-md bg-white shadow-2xl border-amber-200 border-2 relative z-10 rounded-xl">
        <CardHeader className="text-center p-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center mb-6 shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            {tr.schoolName}
          </CardTitle>
          <p className="text-muted-foreground text-lg">{tr.loginPrompt}</p>
          <p className="text-sm text-muted-foreground arabic-text mt-2">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {tr.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? tr.loggingIn : tr.login}
            </Button>
          </form>
          
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-amber-50 to-teal-50 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-teal-700 mb-2">{tr.demoCredentials}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Admin:</span> admin@example.com / password123</p>
              <p><span className="font-medium">Öğretmen:</span> teacher@example.com / password123</p>
              <p><span className="font-medium">Veli:</span> parent@example.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
