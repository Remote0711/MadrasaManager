import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressBar from "@/components/ProgressBar";
import AttendanceTracker from "@/components/AttendanceTracker";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { StudentWithClass } from "@shared/schema";

export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [pagesDone, setPagesDone] = useState("");
  const [behaviorNote, setBehaviorNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/teacher/students'],
  });

  const progressMutation = useMutation({
    mutationFn: async (data: { studentId: string; week: number; pagesDone: number; pagesPlanned: number }) => {
      const response = await apiRequest("POST", "/api/teacher/progress", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: tr.success,
        description: tr.progressSaved,
      });
      setSelectedStudent("");
      setPagesDone("");
      setBehaviorNote("");
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
    },
    onError: () => {
      toast({
        title: tr.error,
        description: tr.progressSaveError,
        variant: "destructive",
      });
    },
  });

  const behaviorMutation = useMutation({
    mutationFn: async (data: { studentId: string; week: number; comment: string }) => {
      const response = await apiRequest("POST", "/api/teacher/behavior", data);
      return response.json();
    },
  });

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !pagesDone) {
      toast({
        title: tr.error,
        description: tr.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    const currentWeek = 5; // This would normally be calculated
    const pagesPlanned = 30; // This would come from lesson plan

    progressMutation.mutate({
      studentId: selectedStudent,
      week: currentWeek,
      pagesDone: parseInt(pagesDone),
      pagesPlanned,
    });

    if (behaviorNote.trim()) {
      behaviorMutation.mutate({
        studentId: selectedStudent,
        week: currentWeek,
        comment: behaviorNote.trim(),
      });
    }
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

  // Mock data for demonstration - in real app this would come from API
  const classStats = {
    totalStudents: students.length,
    presentToday: Math.floor(students.length * 0.8),
    averageProgress: 78,
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{tr.teacherDashboard}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{tr.currentWeek}:</span>
            <span className="text-sm font-medium text-gray-900">Hafta 5</span>
          </div>
        </div>

        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sınıfım: T2a</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {classStats.totalStudents}
                </div>
                <div className="text-sm text-gray-500">{tr.totalStudents}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {classStats.presentToday}
                </div>
                <div className="text-sm text-gray-500">{tr.presentToday}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {classStats.averageProgress}%
                </div>
                <div className="text-sm text-gray-500">{tr.averageProgress}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress Input */}
          <Card>
            <CardHeader>
              <CardTitle>{tr.weeklyProgressInput}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProgressSubmit} className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {tr.selectStudent}
                  </Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={tr.selectStudent} />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {tr.completedPages}
                  </Label>
                  <Input
                    type="number"
                    value={pagesDone}
                    onChange={(e) => setPagesDone(e.target.value)}
                    className="mt-1"
                    placeholder="15"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    {tr.behaviorNote}
                  </Label>
                  <Textarea
                    rows={3}
                    value={behaviorNote}
                    onChange={(e) => setBehaviorNote(e.target.value)}
                    className="mt-1"
                    placeholder={tr.behaviorNotePlaceholder}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={progressMutation.isPending}
                >
                  {progressMutation.isPending ? tr.saving : tr.saveProgress}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Attendance Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>{tr.attendance}</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTracker students={students} />
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{tr.studentPerformanceOverview}</CardTitle>
              <Button disabled variant="outline">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                {tr.aiReport} ({tr.comingSoon})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.student}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.progress}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.attendanceRate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.lastUpdate}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.slice(0, 10).map((student, index) => {
                    // Mock progress data - in real app this would come from API
                    const progressPercentage = Math.floor(Math.random() * 40) + 50; // 50-90%
                    const attendanceRate = Math.floor(Math.random() * 30) + 70; // 70-100%
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ProgressBar percentage={progressPercentage} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendanceRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index < 3 ? `${index + 1} gün önce` : `${index + 1} gün önce`}
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
