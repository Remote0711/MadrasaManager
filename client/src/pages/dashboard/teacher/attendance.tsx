import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calendar, Users, Check, X, Clock } from "lucide-react";
import { tr } from "@/lib/tr";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { StudentWithClass } from "@shared/schema";

export default function TeacherAttendance() {
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'excused'>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: students, isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/teacher/students'],
  });

  const attendanceMutation = useMutation({
    mutationFn: async (data: { studentId: string; status: 'present' | 'absent' | 'excused' }) => {
      const response = await apiRequest("POST", "/api/teacher/attendance", {
        studentId: data.studentId,
        week: getCurrentWeek(),
        status: data.status
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Başarılı",
        description: "Devam durumu kaydedildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
    },
    onError: () => {
      toast({
        title: "Hata", 
        description: "Devam durumu kaydedilirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  const handleAttendance = (studentId: string, status: 'present' | 'absent' | 'excused') => {
    // Update local state immediately for UI responsiveness
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
    
    // Send to server
    attendanceMutation.mutate({ studentId, status });
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

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.attendance}</h1>
            <p className="text-muted-foreground">
              Öğrenci devam durumunu işaretleyin - Hafta {getCurrentWeek()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>

        {/* Quick Attendance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => {
            // Get current attendance status from local state, default to 'present'
            const currentStatus = attendanceStatus[student.id] || 'present';
            
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
                    <Badge className={getAttendanceColor(currentStatus)}>
                      {getAttendanceText(currentStatus)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Bu hafta devam durumunu işaretleyin:
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleAttendance(student.id, 'present')}
                        disabled={attendanceMutation.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {tr.present}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleAttendance(student.id, 'absent')}
                        disabled={attendanceMutation.isPending}
                      >
                        <X className="mr-2 h-4 w-4" />
                        {tr.absent}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleAttendance(student.id, 'excused')}
                        disabled={attendanceMutation.isPending}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {tr.excused}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Devam Durumu Tablosu - Hafta {getCurrentWeek()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Öğrenci</th>
                    <th className="text-left py-3 px-4">Sınıf</th>
                    <th className="text-left py-3 px-4">Bu Hafta</th>
                    <th className="text-left py-3 px-4">Bu Ay</th>
                    <th className="text-left py-3 px-4">Toplam</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => {
                    const weeklyStatus = ['present', 'absent', 'excused'][Math.floor(Math.random() * 3)];
                    const monthlyRate = Math.floor(Math.random() * 30) + 70;
                    const totalRate = Math.floor(Math.random() * 20) + 80;
                    
                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{student.firstName} {student.lastName}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {student.class?.name || 'Atanmamış'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getAttendanceColor(weeklyStatus)}>
                            {getAttendanceText(weeklyStatus)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">%{monthlyRate}</td>
                        <td className="py-3 px-4 text-muted-foreground">%{totalRate}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleAttendance(student.id, 'present')}
                              disabled={attendanceMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleAttendance(student.id, 'absent')}
                              disabled={attendanceMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-yellow-600 hover:bg-yellow-50"
                              onClick={() => handleAttendance(student.id, 'excused')}
                              disabled={attendanceMutation.isPending}
                            >
                              <Clock className="h-4 w-4" />
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