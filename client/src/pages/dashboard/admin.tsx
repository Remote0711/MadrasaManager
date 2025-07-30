import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import AddUserDialog from "@/components/forms/AddUserDialog";
import AddStudentDialog from "@/components/forms/AddStudentDialog";
import { tr } from "@/lib/tr";

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalClasses: number;
  programTypes: { name: string; studentCount: number }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/stats/overview'],
  });

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
          <h1 className="text-3xl font-bold text-gray-900">{tr.adminDashboard}</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {tr.totalUsers}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {tr.activeStudents}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalStudents || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {tr.classCount}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalClasses || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {tr.averageProgress}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">76%</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{tr.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AddUserDialog />
                <AddStudentDialog />
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {tr.createLessonPlan}
                </Button>
              </CardContent>
            </Card>

            {/* Program Types */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{tr.programTypes}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.programTypes.map((program) => (
                    <div
                      key={program.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {program.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {program.studentCount} {tr.students}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{tr.recentActivities}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {tr.newStudentRegistration}
                      </p>
                      <p className="text-sm text-gray-500">
                        Zeynep Kaya T2a sınıfına kaydedildi
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      2 saat önce
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {tr.attendanceCompleted}
                      </p>
                      <p className="text-sm text-gray-500">
                        T1a sınıfı için Hafta 5 devam durumu güncellendi
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      4 saat önce
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {tr.lowProgressWarning}
                      </p>
                      <p className="text-sm text-gray-500">
                        T3b sınıfında 3 öğrenci %50'nin altında
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      1 gün önce
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
