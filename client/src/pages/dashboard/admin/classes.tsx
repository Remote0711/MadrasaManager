import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Users, MoreHorizontal, Eye } from "lucide-react";
import { tr } from "@/lib/tr";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Class, ProgramType } from "@shared/schema";

interface ClassWithRelations extends Class {
  programType?: {
    id: string;
    name: string;
  };
  students?: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
}

const updateClassSchema = z.object({
  name: z.string().min(1, "Sınıf adı gereklidir"),
  level: z.number().min(1, "Seviye 1'den büyük olmalıdır"),
  programTypeId: z.string().min(1, "Program türü seçilmelidir"),
});

type UpdateClassData = z.infer<typeof updateClassSchema>;

export default function AdminClasses() {
  const [editingClass, setEditingClass] = useState<ClassWithRelations | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: classes, isLoading } = useQuery<ClassWithRelations[]>({
    queryKey: ['/api/admin/classes'],
  });

  const { data: programTypes = [] } = useQuery<ProgramType[]>({
    queryKey: ['/api/admin/program-types'],
  });

  const form = useForm<UpdateClassData>({
    resolver: zodResolver(updateClassSchema),
    defaultValues: {
      name: "",
      level: 1,
      programTypeId: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateClassData & { id: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/classes/${data.id}`, data);
      if (!response.ok) {
        throw new Error("Sınıf güncellenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/classes"] });
      toast({
        title: "Başarılı",
        description: "Sınıf bilgileri başarıyla güncellendi",
      });
      setEditDialogOpen(false);
      setEditingClass(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Sınıf güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (classItem: ClassWithRelations) => {
    setEditingClass(classItem);
    form.reset({
      name: classItem.name,
      level: classItem.level,
      programTypeId: classItem.programTypeId,
    });
    setEditDialogOpen(true);
  };

  const handleViewStudents = (classItem: ClassWithRelations) => {
    console.log('Navigating to students with classId:', classItem.id);
    // Navigate to students page with class filter
    setLocation(`/dashboard/admin/students?classId=${classItem.id}`);
  };

  const onSubmit = (data: UpdateClassData) => {
    if (!editingClass) return;
    
    const updateData = {
      ...data,
      id: editingClass.id,
    };
    
    updateMutation.mutate(updateData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.classes}</h1>
            <p className="text-muted-foreground">
              Sınıf bilgilerini yönetin
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sınıf Ekle
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes?.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {classItem.name}
                  </div>
                  <Badge variant="outline">
                    {classItem.programType?.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {classItem.students?.length || 0} öğrenci
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Program:</span> {classItem.programType?.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Durum:</span>{" "}
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Aktif
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewStudents(classItem)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Öğrenciler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Classes Table - Alternative view */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Sınıf Listesi ({classes?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sınıf Adı</th>
                    <th className="text-left py-3 px-4">Program Türü</th>
                    <th className="text-left py-3 px-4">Öğrenci Sayısı</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {classes?.map((classItem) => (
                    <tr key={classItem.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{classItem.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {classItem.programType?.name}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {classItem.students?.length || 0} öğrenci
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Aktif
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">İşlemleri aç</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(classItem)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewStudents(classItem)}>
                              <Users className="mr-2 h-4 w-4" />
                              Öğrenciler ({classItem.students?.length || 0})
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Class Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Sınıf Bilgilerini Düzenle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sınıf Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örn: 1A, 2B, İleri Seviye" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seviye</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          value={field.value || 1}
                          min="1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Türü</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Program türü seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programTypes.map((programType) => (
                            <SelectItem key={programType.id} value={programType.id}>
                              {programType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}