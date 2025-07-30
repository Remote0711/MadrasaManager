import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/ParentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, Calendar, Target } from "lucide-react";
import { tr } from "@/lib/tr";
import type { StudentWithClass, StudentProgress } from "@shared/schema";

export default function ParentProgress() {
  const { data: child, isLoading: childLoading } = useQuery<StudentWithClass>({
    queryKey: ['/api/parent/child'],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<StudentProgress[]>({
    queryKey: [`/api/student/${child?.id}/progress`],
    enabled: !!child?.id,
  });

  if (childLoading || progressLoading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ParentLayout>
    );
  }

  if (!child) {
    return (
      <ParentLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Çocuk bilgisi bulunamadı.</p>
        </div>
      </ParentLayout>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBadgeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Calculate overall progress
  const overallProgress = progress?.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + (p.pagesDone / p.pagesPlanned * 100), 0) / progress.length)
    : 0;

  const totalPagesCompleted = progress?.reduce((sum, p) => sum + p.pagesDone, 0) || 0;
  const totalPagesPlanned = progress?.reduce((sum, p) => sum + p.pagesPlanned, 0) || 0;

  return (
    <ParentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.progress}</h1>
            <p className="text-muted-foreground">
              {child.firstName} {child.lastName} - {child.class?.name} ({child.class?.programType?.name})
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genel İlerleme</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
                %{overallProgress}
              </div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalPagesCompleted}</div>
              <p className="text-xs text-muted-foreground">sayfa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hedef</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalPagesPlanned}</div>
              <p className="text-xs text-muted-foreground">sayfa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Hafta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {progress?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">hafta</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Haftalık İlerleme Raporu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress && progress.length > 0 ? (
                progress.map((weekProgress) => {
                  const percentage = Math.round((weekProgress.pagesDone / weekProgress.pagesPlanned) * 100);
                  
                  return (
                    <div key={weekProgress.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Hafta {weekProgress.week}</span>
                          <span className="text-sm text-muted-foreground">
                            {weekProgress.pagesDone} / {weekProgress.pagesPlanned} sayfa
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <Badge className={getProgressBadgeColor(percentage)}>
                          %{percentage}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz ilerleme kaydı bulunmuyor.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>İlerleme Grafiği</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-muted-foreground">İlerleme grafiği yakında eklenecek</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}