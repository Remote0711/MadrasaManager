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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern"></div>
      
      {/* Islamic decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-5">
        <div className="w-full h-full border-4 border-primary rotate-45 rounded-lg"></div>
      </div>
      <div className="absolute bottom-20 right-20 w-24 h-24 opacity-5">
        <div className="w-full h-full border-4 border-secondary rotate-12 rounded-full"></div>
      </div>
      
      <Card className="w-full max-w-md islamic-card relative">
        <CardHeader className="text-center islamic-ornament">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
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
              className="w-full islamic-button h-12 text-lg font-semibold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? tr.loggingIn : tr.login}
            </Button>
          </form>
          
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
            <p className="text-sm font-medium text-primary mb-2">{tr.demoCredentials}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Admin:</span> admin / 123456</p>
              <p><span className="font-medium">Öğretmen:</span> ogretmen / 123456</p>
              <p><span className="font-medium">Veli:</span> veli / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
