import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Plus, Save, Users, BookOpen } from "lucide-react";
import { tr } from "@/lib/tr";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { Student } from "@shared/schema";

export default function TeacherProgress() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [completedPages, setCompletedPages] = useState<string>("");
  const [behaviorNote, setBehaviorNote] = useState<string>("");
  
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/teacher/students'],
  });

  const progressMutation = useMutation({
    mutationFn: async (data: {
      studentId: string;
      weekNumber: number;
      completedPages: number;
      behaviorNote: string;
    }) => {
      const response = await apiRequest("POST", "/api/teacher/progress", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
      setSelectedStudent("");
      setCompletedPages("");
      setBehaviorNote("");
    },
  });

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !completedPages) return;

    progressMutation.mutate({
      studentId: selectedStudent,
      weekNumber: getCurrentWeek(),
      completedPages: parseInt(completedPages),
      behaviorNote: behaviorNote || "",
    });
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

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-100 text-green-800';
    if (progress >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Mock progress data
  const mockProgress = (studentId: string) => Math.floor(Math.random() * 100);

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{tr.progress}</h1>
            <p className="text-muted-foreground">
              Öğrenci ilerlemelerini kaydedin - Hafta {getCurrentWeek()}
            </p>
          </div>
        </div>

        {/* Progress Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              {tr.weeklyProgressInput}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{tr.selectStudent}</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Öğrenci seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{tr.completedPages}</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={completedPages}
                    onChange={(e) => setCompletedPages(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{tr.behaviorNote}</label>
                <Textarea
                  placeholder={tr.behaviorNotePlaceholder}
                  value={behaviorNote}
                  onChange={(e) => setBehaviorNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                disabled={!selectedStudent || !completedPages || progressMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {progressMutation.isPending ? tr.saving : tr.saveProgress}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Student Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => {
            const progress = mockProgress(student.id);
            const weeklyPages = Math.floor(Math.random() * 25) + 5;
            
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-muted-foreground">Öğrenci</div>
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
                      <BookOpen className="mr-2 h-4 w-4" />
                      Bu hafta: {weeklyPages} sayfa
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Son güncelleme: {Math.floor(Math.random() * 7) + 1} gün önce
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      İlerleme Ekle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              {tr.studentPerformanceOverview}
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
                    <th className="text-left py-3 px-4">Genel İlerleme</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">Son Güncelleme</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => {
                    const progress = mockProgress(student.id);
                    const weeklyPages = Math.floor(Math.random() * 25) + 5;
                    const status = progress >= 70 ? 'successful' : progress >= 50 ? 'improving' : 'needsAttention';
                    
                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{student.firstName} {student.lastName}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          Öğrenci
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{weeklyPages} sayfa</td>
                        <td className="py-3 px-4">
                          <Badge className={getProgressColor(progress)}>
                            %{progress}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            status === 'successful' ? 'bg-green-100 text-green-800' :
                            status === 'improving' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status === 'successful' ? 'Başarılı' :
                             status === 'improving' ? 'Gelişiyor' : 'Dikkat Gerekiyor'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {Math.floor(Math.random() * 7) + 1} gün önce
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