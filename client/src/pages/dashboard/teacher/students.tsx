import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TeacherLayout from "@/components/TeacherLayout";
import SubjectProgressForm from "@/components/SubjectProgressForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Eye, TrendingUp, MoreHorizontal, BookOpen, Calendar, CheckCircle, UserCheck, UserX, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tr } from "@/lib/tr";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  type StudentWithClass, 
  type Class,
  insertStudentSchema,
  type InsertStudent 
} from "@shared/schema";
import { z } from "zod";

const updateStudentSchema = insertStudentSchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  classId: true,
});

type UpdateStudentData = z.infer<typeof updateStudentSchema>;

export default function TeacherStudents() {
  const [editingStudent, setEditingStudent] = useState<StudentWithClass | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [progressStudent, setProgressStudent] = useState<StudentWithClass | null>(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/teacher/students'],
  });

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

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
      const response = await apiRequest("PATCH", `/api/teacher/students/${data.id}`, data);
      if (!response.ok) {
        throw new Error("Öğrenci güncellenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/students"] });
      toast({
        title: "Başarılı",
        description: "Öğrenci bilgileri başarıyla güncellendi",
      });
      setEditDialogOpen(false);
      setEditingStudent(null);
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Öğrenci güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (student: StudentWithClass) => {
    setEditingStudent(student);
    form.reset({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth || "",
      classId: student.classId,
    });
    setEditDialogOpen(true);
  };

  const openProgressDialog = (student: StudentWithClass) => {
    setProgressStudent(student);
    setProgressDialogOpen(true);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  const onSubmit = (data: UpdateStudentData) => {
    if (!editingStudent) return;
    updateMutation.mutate({ ...data, id: editingStudent.id });
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </TeacherLayout>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-100 text-green-800';
    if (progress >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Mock progress data - in real app this would come from API
  const mockProgress = (studentId: string) => Math.floor(Math.random() * 100);

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.myStudents}</h1>
            <p className="text-muted-foreground">
              Öğrencilerinizi takip edin ve değerlendirin
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Toplam: {students?.length || 0} öğrenci
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => {
            const progress = mockProgress(student.id);
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-muted-foreground">{student.class?.name}</div>
                      </div>
                    </div>
                    <Badge className={getProgressColor(progress)}>
                      %{progress}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Son hafta: {Math.floor(Math.random() * 20)} sayfa
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Program:</span> {student.class?.programType?.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Kayıt:</span>{" "}
                        {new Date(student.enrollmentDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        Detay
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Düzenle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openProgressDialog(student)}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <BookOpen className="mr-1 h-3 w-3" />
                        İlerleme
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
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
                    <th className="text-left py-3 px-4">İlerleme</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => {
                    const progress = mockProgress(student.id);
                    return (
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
                          <Badge className={getProgressColor(progress)}>
                            %{progress}
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
                                Detayları Görüntüle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(student)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Bilgileri Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openProgressDialog(student)}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Ders İlerlemesi
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
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
              <DialogDescription>
                Öğrenci bilgilerini güncelleyin. Sadece gerekli alanları değiştirin.
              </DialogDescription>
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
                          <Input {...field} placeholder="Öğrencinin adı" />
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
                          <Input {...field} placeholder="Öğrencinin soyadı" />
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
                        <Input 
                          {...field} 
                          type="date" 
                          value={field.value || ''}
                        />
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
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
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

        {/* Subject Progress Dialog */}
        <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Ders İlerlemesi Takibi
              </DialogTitle>
            </DialogHeader>
            {progressStudent && (
              <SubjectProgressForm
                studentId={progressStudent.id}
                studentName={`${progressStudent.firstName} ${progressStudent.lastName}`}
                week={getCurrentWeek()}
                plannedPages={{ from: 1, to: 10 }} // This would come from lesson plans in real app
                onSuccess={() => {
                  setProgressDialogOpen(false);
                  setProgressStudent(null);
                  queryClient.invalidateQueries({ queryKey: ["/api/teacher/students"] });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}