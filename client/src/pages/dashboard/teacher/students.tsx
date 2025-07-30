import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Eye, TrendingUp } from "lucide-react";
import { tr } from "@/lib/tr";
import type { Student } from "@shared/schema";

export default function TeacherStudents() {
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/teacher/students'],
  });

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            İlerleme Ekle
          </Button>
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
                        <div className="text-sm font-medium">{student.name}</div>
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

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Detay
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
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
                    <th className="text-left py-3 px-4">İlerleme</th>
                    <th className="text-left py-3 px-4">Son Aktivite</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => {
                    const progress = mockProgress(student.id);
                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {student.class?.name || 'Atanmamış'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {student.class?.programType?.name || 'Belirsiz'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getProgressColor(progress)}>
                            %{progress}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {Math.floor(Math.random() * 7) + 1} gün önce
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}