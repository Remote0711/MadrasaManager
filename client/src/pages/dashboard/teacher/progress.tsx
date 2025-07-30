import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Plus, Save, Users, BookOpen, Edit, X, Clock, LogOut } from "lucide-react";
import { tr } from "@/lib/tr";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { Student } from "@shared/schema";

export default function TeacherProgress() {
  const queryClient = useQueryClient();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [weeklyPages, setWeeklyPages] = useState<string>("");
  const [quranPage, setQuranPage] = useState<string>("");
  const [surahName, setSurahName] = useState<string>("");
  const [ayahNumber, setAyahNumber] = useState<string>("");
  const [behaviorNote, setBehaviorNote] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState<string[]>([]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, string[]>>({});
  
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/teacher/students'],
  });

  const progressMutation = useMutation({
    mutationFn: async (data: {
      studentId: string;
      week: number;
      pagesDone: number;
      pagesPlanned: number;
    }) => {
      const response = await apiRequest("POST", "/api/teacher/progress", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
      setEditingStudent(null);
      setEditDialogOpen(false);
      setWeeklyPages("");
      setQuranPage("");
      setSurahName("");
      setAyahNumber("");
      setBehaviorNote("");
      setAttendanceStatus([]);
    },
  });

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
    // Pre-fill with current data if available
    setWeeklyPages("");
    setQuranPage("");
    setSurahName("");
    setAyahNumber("");
    setBehaviorNote("");
    setAttendanceStatus([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !weeklyPages) return;

    progressMutation.mutate({
      studentId: editingStudent.id,
      week: getCurrentWeek(),
      pagesDone: parseInt(weeklyPages),
      pagesPlanned: parseInt(weeklyPages) + 5, // Set planned pages slightly higher than completed
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

  // Stable mock progress data using student ID as seed
  const mockProgress = (studentId: string) => {
    // Create a simple hash from studentId to get consistent pseudo-random numbers
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      const char = studentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to generate a consistent progress percentage
    const progress = Math.abs(hash) % 100;
    return Math.max(20, progress); // Ensure minimum 20% progress
  };

  // Stable mock weekly pages using student ID as seed
  const mockWeeklyPages = (studentId: string) => {
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      const char = studentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Generate consistent weekly pages between 5 and 30
    return Math.abs(hash) % 26 + 5;
  };

  // Stable mock status using student ID as seed
  const mockStatus = (studentId: string) => {
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      const char = studentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const statusIndex = Math.abs(hash) % 3;
    return ['successful', 'improving', 'needs_attention'][statusIndex];
  };

  const toggleAttendanceStatus = (studentId: string, status: 'late' | 'early') => {
    setStudentAttendanceMap(prev => {
      const currentStatuses = prev[studentId] || [];
      const updatedStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status];
      
      return {
        ...prev,
        [studentId]: updatedStatuses
      };
    });
  };

  const getStudentAttendanceStatuses = (studentId: string) => {
    return studentAttendanceMap[studentId] || [];
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 islamic-pattern"></div>
          <div className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {tr.progress}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  <span className="inline-block w-1 h-4 bg-primary/60 mr-2 rounded"></span>
                  Öğrenci ilerlemelerini takip edin ve düzenleyin - Hafta {getCurrentWeek()}
                </p>
                <p className="text-sm text-muted-foreground arabic-text mt-2">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{students?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
              </div>
            </div>
          </div>
        </div>



        {/* Enhanced Progress Tracking Table */}
        <Card className="islamic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <TrendingUp className="mr-3 h-6 w-6 text-primary" />
              Öğrenci İlerleme Takibi - Hafta {getCurrentWeek()}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Öğrencilerinizin haftalık ilerlemelerini takip edin ve düzenleyin
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-4 px-4 font-semibold">Öğrenci</th>
                    <th className="text-left py-4 px-4 font-semibold">Haftalık Sayfa</th>
                    <th className="text-left py-4 px-4 font-semibold">Kur'an Sayfası</th>
                    <th className="text-left py-4 px-4 font-semibold">Ezber Durumu</th>
                    <th className="text-left py-4 px-4 font-semibold">Devam Durumu</th>
                    <th className="text-left py-4 px-4 font-semibold">Genel İlerleme</th>
                    <th className="text-right py-4 px-4 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => {
                    const progress = mockProgress(student.id);
                    const weeklyPages = mockWeeklyPages(student.id);
                    const status = mockStatus(student.id);
                    
                    return (
                      <tr key={student.id} className="border-b hover:bg-primary/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">Öğrenci</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-primary">{weeklyPages} sayfa</div>
                          <div className="text-xs text-muted-foreground">Bu hafta</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-secondary">{Math.abs(student.id.charCodeAt(1)) % 604 + 1}</div>
                          <div className="text-xs text-muted-foreground">Mushaf</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="font-medium">Fatiha</div>
                            <div className="text-xs text-muted-foreground">{Math.abs(student.id.charCodeAt(2)) % 7 + 1}. Ayet</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            {/* Always show base attendance */}
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 w-fit">
                              Geldi
                            </span>
                            
                            {/* Quick attendance controls */}
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant={getStudentAttendanceStatuses(student.id).includes('late') ? "default" : "outline"}
                                className={`text-xs px-2 py-1 h-6 ${getStudentAttendanceStatuses(student.id).includes('late') ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'hover:bg-yellow-50'}`}
                                onClick={() => toggleAttendanceStatus(student.id, 'late')}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Geç
                              </Button>
                              
                              <Button
                                size="sm"
                                variant={getStudentAttendanceStatuses(student.id).includes('early') ? "default" : "outline"}
                                className={`text-xs px-2 py-1 h-6 ${getStudentAttendanceStatuses(student.id).includes('early') ? 'bg-orange-100 text-orange-800 border-orange-300' : 'hover:bg-orange-50'}`}
                                onClick={() => toggleAttendanceStatus(student.id, 'early')}
                              >
                                <LogOut className="w-3 h-3 mr-1" />
                                Erken
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getProgressColor(progress)}>
                            %{progress}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(student)}
                            className="islamic-button-secondary"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Progress Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] islamic-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                İlerleme Düzenle - {editingStudent?.firstName} {editingStudent?.lastName}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyPages" className="text-sm font-medium">
                    Haftalık Tamamlanan Sayfa Sayısı *
                  </Label>
                  <Input
                    id="weeklyPages"
                    type="number"
                    placeholder="0"
                    value={weeklyPages}
                    onChange={(e) => setWeeklyPages(e.target.value)}
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quranPage" className="text-sm font-medium">
                    Kur'an Son Sayfa (Mushaf)
                  </Label>
                  <Input
                    id="quranPage"
                    type="number"
                    placeholder="1-604"
                    value={quranPage}
                    onChange={(e) => setQuranPage(e.target.value)}
                    min="1"
                    max="604"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surahName" className="text-sm font-medium">
                    Ezber - Surah Adı
                  </Label>
                  <Input
                    id="surahName"
                    type="text"
                    placeholder="Örn: Fatiha, Bakara"
                    value={surahName}
                    onChange={(e) => setSurahName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ayahNumber" className="text-sm font-medium">
                    Ayet Numarası
                  </Label>
                  <Input
                    id="ayahNumber"
                    type="number"
                    placeholder="1"
                    value={ayahNumber}
                    onChange={(e) => setAyahNumber(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Devam Durumu
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="came-late"
                      checked={attendanceStatus.includes('late')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAttendanceStatus([...attendanceStatus, 'late']);
                        } else {
                          setAttendanceStatus(attendanceStatus.filter(status => status !== 'late'));
                        }
                      }}
                    />
                    <Label htmlFor="came-late" className="flex items-center cursor-pointer">
                      <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                      Geç geldi
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="left-early"
                      checked={attendanceStatus.includes('early')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAttendanceStatus([...attendanceStatus, 'early']);
                        } else {
                          setAttendanceStatus(attendanceStatus.filter(status => status !== 'early'));
                        }
                      }}
                    />
                    <Label htmlFor="left-early" className="flex items-center cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2 text-orange-600" />
                      Erken çıktı
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="behaviorNote" className="text-sm font-medium">
                  Davranış Notu (Değerlendirme)
                </Label>
                <Textarea
                  id="behaviorNote"
                  placeholder="Öğrencinin haftalık davranış değerlendirmesi..."
                  value={behaviorNote}
                  onChange={(e) => setBehaviorNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={!weeklyPages || progressMutation.isPending}
                  className="islamic-button"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {progressMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}