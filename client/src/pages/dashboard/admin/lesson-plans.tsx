import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tr } from "@/lib/tr";
import { 
  type LessonPlan, 
  type ProgramType
} from "@shared/schema";

export default function AdminLessonPlans() {
  const [selectedWeek, setSelectedWeek] = useState<string>("all");

  const { data: lessonPlans = [], isLoading } = useQuery<LessonPlan[]>({
    queryKey: ['/api/admin/lesson-plans'],
  });

  const { data: programTypes = [] } = useQuery<ProgramType[]>({
    queryKey: ['/api/admin/program-types'],
  });

  // Enhanced lesson plans with calculated fields and program type information
  const enhancedLessonPlans = useMemo(() => {
    return lessonPlans.map(plan => {
      const programType = programTypes.find(pt => pt.id === plan.programTypeId);
      return {
        ...plan,
        programType,
        title: `${plan.subject} - Hafta ${plan.week}`,
        totalPages: plan.pagesTo - plan.pagesFrom + 1,
        status: 'planned' as const
      };
    });
  }, [lessonPlans, programTypes]);

  // Filter lesson plans by selected week
  const filteredLessonPlans = useMemo(() => {
    if (selectedWeek === "all") return enhancedLessonPlans;
    return enhancedLessonPlans.filter(plan => plan.week.toString() === selectedWeek);
  }, [enhancedLessonPlans, selectedWeek]);

  // Get unique weeks for filter dropdown
  const availableWeeks = useMemo(() => {
    const weeks = [...new Set(enhancedLessonPlans.map(plan => plan.week))].sort((a, b) => a - b);
    return weeks;
  }, [enhancedLessonPlans]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'in-progress':
        return 'Devam Ediyor';
      case 'planned':
        return 'Planlandı';
      default:
        return 'Bilinmiyor';
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
              Haftalık ders planlarını görüntüleyin ve takip edin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Hafta seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Haftalar</SelectItem>
                  {availableWeeks.map((week) => (
                    <SelectItem key={week} value={week.toString()}>
                      Hafta {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredLessonPlans.length} plan görüntüleniyor
            </div>
          </div>
        </div>

        {/* Lesson Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessonPlans.map((plan) => (
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

                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <span className="font-medium">Konu:</span> {plan.subject}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLessonPlans.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {selectedWeek === "all" ? "Henüz ders planı bulunmuyor" : `Hafta ${selectedWeek} için ders planı bulunamadı`}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {selectedWeek === "all" 
                  ? "Sistem henüz ders planı içermiyor."
                  : "Bu hafta için henüz plan oluşturulmamış. Farklı bir hafta seçin."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Lesson Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Ders Planı Listesi ({filteredLessonPlans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Plan Başlığı</th>
                    <th className="text-left py-3 px-4">Program & Seviye</th>
                    <th className="text-left py-3 px-4">Hafta</th>
                    <th className="text-left py-3 px-4">Sayfa Aralığı</th>
                    <th className="text-left py-3 px-4">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessonPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{plan.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {plan.programType?.name} - Seviye {plan.classLevel}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">Hafta {plan.week}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Sayfa {plan.pagesFrom}-{plan.pagesTo} ({plan.totalPages} sayfa)
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusText(plan.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}