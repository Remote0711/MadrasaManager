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
  const [detailsStudent, setDetailsStudent] = useState<StudentWithClass | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
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

  const handleDetails = (student: StudentWithClass) => {
    setDetailsStudent(student);
    setDetailsDialogOpen(true);
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDetails(student)}
                      >
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

        {/* Student Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {detailsStudent && `${detailsStudent.firstName} ${detailsStudent.lastName}`} - Detaylı İstatistikler
              </DialogTitle>
              <DialogDescription>
                Öğrencinin tüm akademik ve davranışsal verilerinin kapsamlı görünümü
              </DialogDescription>
            </DialogHeader>
            
            {detailsStudent && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Temel Bilgiler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Ad Soyad</div>
                        <div className="text-lg font-semibold">{detailsStudent.firstName} {detailsStudent.lastName}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Sınıf</div>
                        <div className="text-lg font-semibold">{detailsStudent.class?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Program Türü</div>
                        <div className="text-lg font-semibold">{detailsStudent.class?.programType?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</div>
                        <div className="text-lg font-semibold">
                          {new Date(detailsStudent.enrollmentDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      {detailsStudent.dateOfBirth && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Doğum Tarihi</div>
                          <div className="text-lg font-semibold">
                            {new Date(detailsStudent.dateOfBirth).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Attendance Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Devam İstatistikleri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <UserCheck className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-sm text-muted-foreground">Devam Oranı</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <UserX className="mx-auto h-8 w-8 text-red-600 mb-2" />
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-muted-foreground">Devamsızlık</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Clock className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">2</div>
                        <div className="text-sm text-muted-foreground">Mazeretli</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Son 5 Hafta Devam Durumu</div>
                      <div className="flex space-x-2">
                        {[
                          { week: 'Hafta 1', status: 'present' },
                          { week: 'Hafta 2', status: 'present' },
                          { week: 'Hafta 3', status: 'absent' },
                          { week: 'Hafta 4', status: 'present' },
                          { week: 'Hafta 5', status: 'excused' }
                        ].map((item, index) => (
                          <div key={index} className="flex-1 text-center">
                            <div className="text-xs text-muted-foreground mb-1">{item.week}</div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              item.status === 'present' ? 'bg-green-100 text-green-800' :
                              item.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status === 'present' ? 'Geldi' : 
                               item.status === 'absent' ? 'Gelmedi' : 'Mazeretli'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Akademik İlerleme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <BookOpen className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                          <div className="text-2xl font-bold text-blue-600">87%</div>
                          <div className="text-sm text-muted-foreground">Kur'an İlerlemesi</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <CheckCircle className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                          <div className="text-2xl font-bold text-purple-600">92%</div>
                          <div className="text-sm text-muted-foreground">Ezber Başarısı</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <TrendingUp className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                          <div className="text-2xl font-bold text-orange-600">89%</div>
                          <div className="text-sm text-muted-foreground">Genel Başarı</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Haftalık İlerleme</div>
                        <div className="space-y-2">
                          {[
                            { subject: 'Kur\'an-ı Kerim', planned: 15, completed: 13, week: 'Bu hafta' },
                            { subject: 'Ezber (Al-Fatiha)', planned: 7, completed: 7, week: 'Bu hafta' },
                            { subject: 'Temel Bilgiler', planned: 10, completed: 8, week: 'Bu hafta' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{item.subject}</div>
                                <div className="text-sm text-muted-foreground">{item.week}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{item.completed}/{item.planned}</div>
                                <div className="text-sm text-muted-foreground">
                                  %{Math.round((item.completed / item.planned) * 100)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Behavior & Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Davranış ve Notlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">8.5/10</div>
                          <div className="text-sm text-muted-foreground">Davranış Puanı</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">Dikkatli</div>
                          <div className="text-sm text-muted-foreground">Genel Davranış</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Son Öğretmen Notları</div>
                        <div className="space-y-2">
                          {[
                            { date: '2025-01-29', note: 'Çok başarılı, aktif katılım gösterdi. Kur\'an okumada gelişim gösteriyor.' },
                            { date: '2025-01-22', note: 'İyi çalışıyor, biraz daha odaklanabilir. Ezber konusunda gayet başarılı.' },
                            { date: '2025-01-15', note: 'Mükemmel performans, tüm konularda başarılı. Arkadaşlarına yardımcı oluyor.' }
                          ].map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded">
                              <div className="text-sm text-muted-foreground mb-1">
                                {new Date(item.date).toLocaleDateString('tr-TR')}
                              </div>
                              <div className="text-sm">{item.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setDetailsDialogOpen(false)}>
                Kapat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}