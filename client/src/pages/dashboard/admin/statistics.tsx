import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Clock,
  CalendarDays,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";

interface ExtendedStats {
  totalUsers: number;
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  programTypes: { name: string; studentCount: number }[];
  teacherAttendance: {
    present: number;
    absent: number;
    late: number;
    total: number;
    presentList: Array<{ name: string; arrivalTime: string; status: 'on_time' | 'late' }>;
    absentList: Array<{ name: string; expectedTime: string }>;
  };
  studentProgress: {
    excellent: number; // 90%+
    good: number; // 70-89%
    needsAttention: number; // <70%
    averageProgress: number;
  };
  weeklyStats: {
    currentWeek: number;
    lessonsPlanned: number;
    lessonsCompleted: number;
    attendanceRate: number;
  };
  recentActivity: Array<{
    type: 'student_progress' | 'teacher_attendance' | 'new_enrollment';
    message: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'success';
  }>;
}

export default function AdminStatistics() {
  const { data: stats, isLoading } = useQuery<ExtendedStats>({
    queryKey: ['/api/admin/statistics'],
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

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 islamic-pattern"></div>
          <div className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Kapsamlı İstatistikler
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  <span className="inline-block w-1 h-4 bg-primary/60 mr-2 rounded"></span>
                  Okul yönetimi için detaylı istatistiksel veriler - Hafta {getCurrentWeek()}
                </p>
                <p className="text-sm text-muted-foreground arabic-text mt-2">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</div>
                <div className="text-sm text-muted-foreground">Toplam Kullanıcı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="islamic-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Toplam Öğretmen
                    </dt>
                    <dd className="text-lg font-medium">
                      {stats?.totalTeachers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="islamic-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Aktif Öğrenci
                    </dt>
                    <dd className="text-lg font-medium">
                      {stats?.totalStudents || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="islamic-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Toplam Sınıf
                    </dt>
                    <dd className="text-lg font-medium">
                      {stats?.totalClasses || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="islamic-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Ortalama İlerleme
                    </dt>
                    <dd className="text-lg font-medium">
                      %{stats?.studentProgress?.averageProgress || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Attendance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="islamic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                <UserCheck className="mr-3 h-6 w-6 text-primary" />
                Öğretmen Devam Durumu - Bugün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.teacherAttendance?.present || 0}
                  </div>
                  <div className="text-sm text-green-700">Geldi</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.teacherAttendance?.late || 0}
                  </div>
                  <div className="text-sm text-yellow-700">Geç</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {stats?.teacherAttendance?.absent || 0}
                  </div>
                  <div className="text-sm text-red-700">Yok</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Gelmiş Öğretmenler
                </h4>
                {stats?.teacherAttendance?.presentList?.map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">{teacher.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={teacher.status === 'on_time' ? 'default' : 'secondary'}>
                        {teacher.status === 'on_time' ? 'Zamanında' : 'Geç'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{teacher.arrivalTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {stats?.teacherAttendance?.absentList && stats.teacherAttendance.absentList.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Gelmeyen Öğretmenler
                  </h4>
                  {stats.teacherAttendance.absentList.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                      <span className="font-medium text-red-800">{teacher.name}</span>
                      <span className="text-xs text-red-600">Beklenen: {teacher.expectedTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Progress Overview */}
          <Card className="islamic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                <Award className="mr-3 h-6 w-6 text-primary" />
                Öğrenci İlerleme Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Mükemmel (%90+)</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {stats?.studentProgress?.excellent || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium">İyi (%70-89)</span>
                  </div>
                  <div className="text-xl font-bold text-yellow-600">
                    {stats?.studentProgress?.good || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium">Dikkat Gerekiyor (%70 altı)</span>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {stats?.studentProgress?.needsAttention || 0}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    %{stats?.studentProgress?.averageProgress || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Genel Ortalama İlerleme</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="islamic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                <CalendarDays className="mr-3 h-6 w-6 text-primary" />
                Haftalık İstatistikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mevcut Hafta</span>
                  <Badge variant="outline">{stats?.weeklyStats?.currentWeek || getCurrentWeek()}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Planlanan Dersler</span>
                  <span className="text-lg font-bold">{stats?.weeklyStats?.lessonsPlanned || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Tamamlanan Dersler</span>
                  <span className="text-lg font-bold text-green-600">{stats?.weeklyStats?.lessonsCompleted || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Devam Oranı</span>
                  <span className="text-lg font-bold text-primary">%{stats?.weeklyStats?.attendanceRate || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="islamic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                <Clock className="mr-3 h-6 w-6 text-primary" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.severity === 'success' ? 'bg-green-500' :
                      activity.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Program Types Distribution */}
        <Card className="islamic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <BookOpen className="mr-3 h-6 w-6 text-primary" />
              Program Türleri Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats?.programTypes?.map((program, index) => (
                <div key={index} className="text-center p-6 bg-muted/30 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{program.studentCount}</div>
                  <div className="text-sm font-medium">{program.name}</div>
                  <div className="text-xs text-muted-foreground">öğrenci</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}