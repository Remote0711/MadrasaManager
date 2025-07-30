import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import { Plus } from "lucide-react";
import type { Class } from "@shared/schema";

interface StudentFormProps {
  onSuccess?: () => void;
}

export default function StudentForm({ onSuccess }: StudentFormProps) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classId, setClassId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; classId: string }) => {
      const response = await apiRequest("POST", "/api/admin/students", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: tr.success,
        description: tr.studentCreated,
      });
      setOpen(false);
      setFirstName("");
      setLastName("");
      setClassId("");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/students'] });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: tr.error,
        description: tr.studentCreateError,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !classId) {
      toast({
        title: tr.error,
        description: tr.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    createStudentMutation.mutate({ firstName, lastName, classId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {tr.addNewStudent}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tr.addNewStudent}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {tr.firstName}
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={tr.firstNamePlaceholder}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {tr.lastName}
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={tr.lastNamePlaceholder}
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              {tr.class}
            </Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder={tr.selectClass} />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
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
              disabled={createStudentMutation.isPending}
            >
              {createStudentMutation.isPending ? tr.saving : tr.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
