import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GraduationCap, Plus, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { tr } from "@/lib/tr";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Student, Class } from "@shared/schema";
import AddStudentDialog from "@/components/forms/AddStudentDialog";

interface StudentWithRelations extends Student {
  class?: {
    id: string;
    name: string;
    programType?: {
      id: string;
      name: string;
    };
  };
}

const updateStudentSchema = z.object({
  firstName: z.string().min(1, "Ad gereklidir"),
  lastName: z.string().min(1, "Soyad gereklidir"),
  dateOfBirth: z.string().optional(),
  classId: z.string().min(1, "Sınıf seçilmelidir"),
});

type UpdateStudentData = z.infer<typeof updateStudentSchema>;

export default function AdminStudents() {
  const [editingStudent, setEditingStudent] = useState<StudentWithRelations | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentWithRelations | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();

  // Get classId from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const classIdFilter = urlParams.get('classId');
  
  // Debug logging
  console.log('Current location:', location);
  console.log('URL params:', urlParams.toString());
  console.log('Class ID filter:', classIdFilter);

  const { data: allStudents, isLoading } = useQuery<StudentWithRelations[]>({
    queryKey: ['/api/admin/students'],
  });

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

  // Filter students based on classId parameter
  const students = useMemo(() => {
    if (!allStudents) return [];
    if (!classIdFilter) return allStudents;
    return allStudents.filter(student => student.classId === classIdFilter);
  }, [allStudents, classIdFilter]);

  // Get class name for display
  const selectedClass = useMemo(() => {
    if (!classIdFilter || !classes) return null;
    return classes.find(cls => cls.id === classIdFilter);
  }, [classIdFilter, classes]);

  const form = useForm<UpdateStudentData>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      classId: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateStudentData & { id: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/students/${data.id}`, data);
      if (!response.ok) {
        throw new Error("Öğrenci güncellenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla güncellendi",
      });
      setEditDialogOpen(false);
      setEditingStudent(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Öğrenci güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/students/${id}`);
      if (!response.ok) {
        throw new Error("Öğrenci silinirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({
        title: "Başarılı",
        description: "Öğrenci başarıyla silindi",
      });
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Öğrenci silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (student: StudentWithRelations) => {
    setEditingStudent(student);
    form.reset({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth || "",
      classId: student.classId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (student: StudentWithRelations) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: UpdateStudentData) => {
    if (!editingStudent) return;
    
    const updateData = {
      ...data,
      id: editingStudent.id,
      dateOfBirth: data.dateOfBirth === "" ? undefined : data.dateOfBirth,
    };
    
    updateMutation.mutate(updateData);
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;
    deleteMutation.mutate(studentToDelete.id);
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
            <h1 className="text-3xl font-bold">
              {selectedClass ? `${selectedClass.name} - Öğrenciler` : tr.students}
            </h1>
            <p className="text-muted-foreground">
              {selectedClass 
                ? `${selectedClass.name} sınıfındaki ${students?.length || 0} öğrenci`
                : "Öğrenci kayıtlarını yönetin"
              }
            </p>
          </div>
          <div className="flex gap-2">
            {selectedClass && (
              <Button variant="outline" onClick={() => window.history.back()}>
                Geri Dön
              </Button>
            )}
            <AddStudentDialog />
          </div>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Öğrenci Listesi ({students?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Ad Soyad</th>
                    <th className="text-left py-3 px-4">Sınıf</th>
                    <th className="text-left py-3 px-4">Program</th>
                    <th className="text-left py-3 px-4">Kayıt Tarihi</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{student.firstName} {student.lastName}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.class?.name || 'Atanmamış'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {student.class?.programType?.name || 'Belirsiz'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(student.enrollmentDate).toLocaleDateString('tr-TR')}
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(student)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
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

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Öğrenci Bilgilerini Düzenle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soyad</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doğum Tarihi</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sınıf</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sınıf seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
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

        {/* Delete Student Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Öğrenciyi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                {studentToDelete && (
                  <>
                    <strong>{studentToDelete.firstName} {studentToDelete.lastName}</strong> adlı öğrenciyi silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz ve öğrenciye ait tüm veriler (devamsızlık, ilerleme kayıtları vb.) silinecektir.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Siliniyor..." : "Sil"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}