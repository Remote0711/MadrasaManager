import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, BookOpen, Clock, MoreHorizontal, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
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
  type LessonPlan, 
  type ProgramType, 
  insertLessonPlanSchema,
  type InsertLessonPlan 
} from "@shared/schema";
import { z } from "zod";

const lessonPlanFormSchema = insertLessonPlanSchema.extend({
  pagesFrom: z.coerce.number().min(1, "Başlangıç sayfası en az 1 olmalıdır"),
  pagesTo: z.coerce.number().min(1, "Bitiş sayfası en az 1 olmalıdır"),
  week: z.coerce.number().min(1, "Hafta en az 1 olmalıdır").max(52, "Hafta en fazla 52 olabilir"),
  classLevel: z.coerce.number().min(1, "Sınıf seviyesi en az 1 olmalıdır").max(5, "Sınıf seviyesi en fazla 5 olabilir"),
});

type LessonPlanFormData = z.infer<typeof lessonPlanFormSchema>;

export default function AdminLessonPlans() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessonPlans = [], isLoading } = useQuery<LessonPlan[]>({
    queryKey: ['/api/admin/lesson-plans'],
  });

  const { data: programTypes = [] } = useQuery<ProgramType[]>({
    queryKey: ['/api/admin/program-types'],
  });

  const form = useForm<LessonPlanFormData>({
    resolver: zodResolver(lessonPlanFormSchema),
    defaultValues: {
      week: 1,
      subject: "",
      pagesFrom: 1,
      pagesTo: 10,
      classLevel: 1,
      programTypeId: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: LessonPlanFormData) => {
      const response = await apiRequest("POST", "/api/admin/lesson-plans", data);
      if (!response.ok) {
        throw new Error("Ders planı eklenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lesson-plans"] });
      toast({
        title: "Başarılı",
        description: "Yeni ders planı başarıyla oluşturuldu",
      });
      form.reset();
      setAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ders planı oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: LessonPlanFormData & { id: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/lesson-plans/${data.id}`, data);
      if (!response.ok) {
        throw new Error("Ders planı güncellenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lesson-plans"] });
      toast({
        title: "Başarılı",
        description: "Ders planı başarıyla güncellendi",
      });
      setEditDialogOpen(false);
      setEditingPlan(null);
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ders planı güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/lesson-plans/${id}`);
      if (!response.ok) {
        throw new Error("Ders planı silinirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lesson-plans"] });
      toast({
        title: "Başarılı",
        description: "Ders planı başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ders planı silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Enhanced lesson plans with calculated data
  const enhancedLessonPlans = useMemo(() => {
    return lessonPlans.map(plan => {
      const programType = programTypes.find(pt => pt.id === plan.programTypeId);
      const totalPages = plan.pagesTo - plan.pagesFrom + 1;
      return {
        ...plan,
        programType,
        totalPages,
        title: `Hafta ${plan.week} - ${plan.subject}`,
        status: 'active' // For now, all plans are active
      };
    });
  }, [lessonPlans, programTypes]);

  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    form.reset({
      week: plan.week,
      subject: plan.subject,
      pagesFrom: plan.pagesFrom,
      pagesTo: plan.pagesTo,
      classLevel: plan.classLevel,
      programTypeId: plan.programTypeId,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    form.reset();
    setAddDialogOpen(true);
  };

  const onSubmit = (data: LessonPlanFormData) => {
    if (editingPlan) {
      updateMutation.mutate({ ...data, id: editingPlan.id });
    } else {
      addMutation.mutate(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Belirsiz';
    }
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
            <h1 className="text-3xl font-bold">{tr.lessonPlans}</h1>
            <p className="text-muted-foreground">
              Haftalık ders planlarını yönetin
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ders Planı Ekle
          </Button>
        </div>

        {/* Lesson Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedLessonPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">{plan.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {plan.programType?.name} - Seviye {plan.classLevel}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {getStatusText(plan.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Hafta {plan.week}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {plan.totalPages} sayfa (Sayfa {plan.pagesFrom}-{plan.pagesTo})
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => deleteMutation.mutate(plan.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lesson Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Ders Planı Listesi ({lessonPlans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Plan Başlığı</th>
                    <th className="text-left py-3 px-4">Sınıf</th>
                    <th className="text-left py-3 px-4">Hafta</th>
                    <th className="text-left py-3 px-4">Planlanan Sayfa</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedLessonPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{plan.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {plan.programType?.name} - Seviye {plan.classLevel}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">Hafta {plan.week}</td>
                      <td className="py-3 px-4 text-muted-foreground">{plan.totalPages} sayfa</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusText(plan.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteMutation.mutate(plan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Lesson Plan Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yeni Ders Planı Ekle</DialogTitle>
              <DialogDescription>
                Haftalık ders planı oluşturmak için bilgileri doldurun.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hafta</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value || 1}
                            min="1"
                            max="52"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sınıf Seviyesi</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value || 1}
                            min="1"
                            max="5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konu</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örn: Temel Bilgiler, Namaz, İslam Tarihi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pagesFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlangıç Sayfası</FormLabel>
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
                    name="pagesTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bitiş Sayfası</FormLabel>
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
                </div>
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
                    onClick={() => setAddDialogOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Ekleniyor..." : "Ders Planı Ekle"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Plan Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ders Planını Düzenle</DialogTitle>
              <DialogDescription>
                Ders planı bilgilerini güncelleyin.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hafta</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value || 1}
                            min="1"
                            max="52"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sınıf Seviyesi</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value || 1}
                            min="1"
                            max="5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konu</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örn: Temel Bilgiler, Namaz, İslam Tarihi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pagesFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlangıç Sayfası</FormLabel>
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
                    name="pagesTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bitiş Sayfası</FormLabel>
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
                </div>
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