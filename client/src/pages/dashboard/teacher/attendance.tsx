import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { tr } from "@/lib/tr";
import AttendanceTracker from "@/components/AttendanceTracker";
import type { StudentWithClass } from "@shared/schema";

export default function TeacherAttendance() {
  const { data: students, isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/teacher/students'],
  });

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
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

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#005C5C]">{tr.attendance}</h1>
            <p className="text-gray-600">
              Öğrenci devam durumunu işaretleyin - Hafta {getCurrentWeek()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#005C5C]" />
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>

        {/* Student Attendance List */}
        <Card className="border-[#E5E5E5]">
          <CardHeader className="bg-[#FAF8F4]">
            <CardTitle className="flex items-center text-[#005C5C]">
              <Users className="mr-2 h-5 w-5" />
              Devam Durumu - Hafta {getCurrentWeek()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AttendanceTracker students={students || []} />
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}