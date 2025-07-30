import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, BookOpen, Clock } from "lucide-react";
import { tr } from "@/lib/tr";

// Mock data for lesson plans since we don't have API endpoint yet
const mockLessonPlans = [
  {
    id: '1',
    title: 'Hafta 1 - Temel Bilgiler',
    classId: 'class1',
    className: 'T1a',
    weekNumber: 1,
    plannedPages: 15,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Hafta 2 - Namaz Bilgileri',
    classId: 'class1',
    className: 'T1a',
    weekNumber: 2,
    plannedPages: 12,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Hafta 1 - İslam Tarihi',
    classId: 'class2',
    className: 'T2b',
    weekNumber: 1,
    plannedPages: 20,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export default function AdminLessonPlans() {
  // For now using mock data, later this can be replaced with real API call
  const lessonPlans = mockLessonPlans;
  const isLoading = false;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {tr.createLessonPlan}
          </Button>
        </div>

        {/* Lesson Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">{plan.title}</div>
                      <div className="text-xs text-muted-foreground">{plan.className}</div>
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
                    Hafta {plan.weekNumber}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {plan.plannedPages} sayfa planlandı
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Detay
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
                  {lessonPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{plan.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{plan.className}</td>
                      <td className="py-3 px-4 text-muted-foreground">Hafta {plan.weekNumber}</td>
                      <td className="py-3 px-4 text-muted-foreground">{plan.plannedPages} sayfa</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusText(plan.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BookOpen className="h-4 w-4" />
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
      </div>
    </AdminLayout>
  );
}