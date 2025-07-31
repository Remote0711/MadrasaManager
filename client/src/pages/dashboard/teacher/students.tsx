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
  type StudentWithParent,
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
  const [detailsStudent, setDetailsStudent] = useState<StudentWithParent | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/teacher/students'],
  });

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

  const { data: studentDetails, isLoading: isLoadingDetails } = useQuery<StudentWithParent>({
    queryKey: ['/api/teacher/students', detailsStudent?.id],
    enabled: !!detailsStudent?.id && detailsDialogOpen,
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
    setDetailsStudent(student as StudentWithParent);
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

  // Stable mock progress data using student ID as seed - in real app this would come from API
  const mockProgress = (studentId: string) => {
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      const char = studentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const progress = Math.abs(hash) % 100;
    return Math.max(20, progress);
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 islamic-pattern"></div>
          <div className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {tr.myStudents}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  <span className="inline-block w-1 h-4 bg-primary/60 mr-2 rounded"></span>
                  Öğrencilerinizi takip edin ve değerlendirin
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{students?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => {
            const progress = mockProgress(student.id);
            return (
              <Card key={student.id} className="islamic-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 rounded-full bg-primary/60 mr-2"></span>
                          {student.class?.name}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getProgressColor(progress)} px-3 py-1 text-sm font-semibold`}>
                      %{progress}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center text-sm font-medium">
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        Son hafta
                      </div>
                      <span className="text-primary font-semibold">{Math.abs(student.id.charCodeAt(0)) % 20 + 1} sayfa</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Program:</span>
                        <span className="font-medium text-primary">{student.class?.programType?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Kayıt:</span>
                        <span className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-primary/10">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDetails(student)}
                        className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Detay
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(student)}
                        className="border-secondary/50 text-secondary-foreground hover:bg-secondary/20"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Düzenle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openProgressDialog(student)}
                        className="border-accent/50 text-accent-foreground hover:bg-accent/20"
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
        <Card className="islamic-card">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
            <CardTitle className="flex items-center">
              <div className="p-2 rounded-full bg-primary/10 mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-semibold">Öğrenci Listesi ({students?.length || 0})</span>
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
                <Card className="islamic-card border-l-4 border-l-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold">Temel Bilgiler</span>
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

                {/* Parent Contact Information */}
                {(studentDetails?.parent || isLoadingDetails) && (
                  <Card className="islamic-card border-l-4 border-l-[#D4AF37]">
                    <CardHeader className="bg-gradient-to-r from-[#D4AF37]/5 to-[#F5E6A3]/5">
                      <CardTitle className="flex items-center">
                        <div className="p-2 rounded-full bg-[#D4AF37]/10 mr-3">
                          <UserCheck className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        <span className="text-lg font-semibold text-[#D4AF37]">Veli İletişim Bilgileri</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingDetails ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                        </div>
                      ) : studentDetails?.parent ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">Veli Adı</div>
                              <div className="text-lg font-semibold text-[#D4AF37]">
                                {studentDetails.parent.user.firstName} {studentDetails.parent.user.lastName}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">İlişki</div>
                              <div className="text-lg font-semibold">{studentDetails.parent.relationship}</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">Telefon Numarası</div>
                              <div className="text-lg font-semibold">
                                <a 
                                  href={`tel:${studentDetails.parent.phoneNumber}`}
                                  className="text-[#D4AF37] hover:underline flex items-center"
                                >
                                  📞 {studentDetails.parent.phoneNumber}
                                </a>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">E-posta</div>
                              <div className="text-lg font-semibold">
                                <a 
                                  href={`mailto:${studentDetails.parent.user.email}`}
                                  className="text-[#D4AF37] hover:underline flex items-center"
                                >
                                  ✉️ {studentDetails.parent.user.email}
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-full">
                            <div className="flex gap-2 pt-4 border-t border-[#D4AF37]/20">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`tel:${studentDetails.parent?.phoneNumber}`, '_self')}
                                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              >
                                📞 Arama Yap
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`mailto:${studentDetails.parent?.user.email}`, '_self')}
                                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              >
                                ✉️ E-posta Gönder
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <UserX className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>Bu öğrenci için veli bilgisi kayıtlı değil</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Attendance Statistics */}
                <Card className="islamic-card border-l-4 border-l-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold">Devam İstatistikleri</span>
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
                <Card className="islamic-card border-l-4 border-l-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold">Akademik İlerleme</span>
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
                <Card className="islamic-card border-l-4 border-l-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold">Davranış ve Notlar</span>
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