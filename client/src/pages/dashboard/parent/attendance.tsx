import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/ParentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calendar, Check, X, Clock, TrendingUp } from "lucide-react";
import { tr } from "@/lib/tr";
import type { StudentWithClass, AttendanceRecord } from "@shared/schema";

export default function ParentAttendance() {
  const { data: child, isLoading: childLoading } = useQuery<StudentWithClass>({
    queryKey: ['/api/parent/child'],
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery<AttendanceRecord[]>({
    queryKey: [`/api/student/${child?.id}/attendance`],
    enabled: !!child?.id,
  });

  if (childLoading || attendanceLoading) {
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

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <X className="h-4 w-4 text-red-600" />;
      case 'excused':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'excused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceText = (status: string) => {
    switch (status) {
      case 'present':
        return tr.present;
      case 'absent':
        return tr.absent;
      case 'excused':
        return tr.excused;
      default:
        return 'Belirsiz';
    }
  };

  // Calculate attendance statistics
  const totalWeeks = attendance?.length || 0;
  const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
  const absentCount = attendance?.filter(a => a.status === 'absent').length || 0;
  const excusedCount = attendance?.filter(a => a.status === 'excused').length || 0;
  const attendanceRate = totalWeeks > 0 ? Math.round((presentCount / totalWeeks) * 100) : 0;

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  return (
    <ParentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.attendance}</h1>
            <p className="text-muted-foreground">
              {child.name} - {child.class?.name} ({child.class?.programType?.name})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Hafta {getCurrentWeek()}
            </span>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devam Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                %{attendanceRate}
              </div>
              <p className="text-xs text-muted-foreground">{totalWeeks} hafta içinde</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Katıldı</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-muted-foreground">hafta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Katılmadı</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-xs text-muted-foreground">hafta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mazeretli</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{excusedCount}</div>
              <p className="text-xs text-muted-foreground">hafta</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Haftalık Devam Kayıtları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance && attendance.length > 0 ? (
                attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getAttendanceIcon(record.status)}
                      <div className="flex flex-col">
                        <span className="font-medium">Hafta {record.week}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <Badge className={getAttendanceColor(record.status)}>
                      {getAttendanceText(record.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz devam kaydı bulunmuyor.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Calendar Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Devam Takvimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-muted-foreground">Devam takvimi yakında eklenecek</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}