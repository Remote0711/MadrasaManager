import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import { Plus } from "lucide-react";

interface UserFormProps {
  onSuccess?: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "TEACHER" | "PARENT">("TEACHER");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; role: string }) => {
      const response = await apiRequest("POST", "/api/admin/users", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: tr.success,
        description: tr.userCreated,
      });
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("TEACHER");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: tr.error,
        description: tr.userCreateError,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      toast({
        title: tr.error,
        description: tr.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate({ name, email, password, role });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {tr.addNewUser}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tr.addNewUser}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {tr.fullName}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr.fullNamePlaceholder}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {tr.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr.emailPlaceholder}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {tr.password}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              {tr.role}
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as "ADMIN" | "TEACHER" | "PARENT")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{tr.roles.admin}</SelectItem>
                <SelectItem value="TEACHER">{tr.roles.teacher}</SelectItem>
                <SelectItem value="PARENT">{tr.roles.parent}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              {tr.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? tr.saving : tr.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
