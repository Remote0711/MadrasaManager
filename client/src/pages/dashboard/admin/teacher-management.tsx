import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, BookOpen, Clock, UserCheck, UserX, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { User, Class, TeacherWithAssignments } from "@shared/schema";

export default function TeacherManagement() {
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [arrivalTime, setArrivalTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teachers = [], isLoading: teachersLoading } = useQuery<TeacherWithAssignments[]>({
    queryKey: ['/api/admin/teacher-assignments'],
  });

  const { data: allTeachers = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/teachers'],
  });

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: { teacherId: string; classId: string; subject: string }) => {
      const response = await apiRequest("POST", "/api/admin/teacher-assignments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-assignments'] });
      setAssignmentDialogOpen(false);
      setSelectedTeacherId("");
      setSelectedClassId("");
      setSelectedSubject("");
      toast({ title: tr.success, description: "Öğretmen ataması başarıyla oluşturuldu" });
    },
    onError: () => {
      toast({ title: tr.error, description: "Atama oluşturulurken hata oluştu", variant: "destructive" });
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/teacher-assignments/${assignmentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-assignments'] });
      toast({ title: tr.success, description: "Öğretmen ataması başarıyla kaldırıldı" });
    },
    onError: () => {
      toast({ title: tr.error, description: "Atama kaldırılırken hata oluştu", variant: "destructive" });
    },
  });

  const createAttendanceMutation = useMutation({
    mutationFn: async (data: {
      teacherId: string;
      date: string;
      status: string;
      arrivalTime?: string;
      notes?: string;
    }) => {
      const response = await apiRequest("POST", "/api/admin/teacher-attendance", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/teacher-attendance'] });
      setAttendanceDialogOpen(false);
      setSelectedTeacherId("");
      setAttendanceStatus("present");
      setArrivalTime("");
      setSessionNotes("");
      toast({ title: tr.success, description: "Öğretmen devamı kaydedildi" });
    },
    onError: () => {
      toast({ title: tr.error, description: "Devam kaydedilirken hata oluştu", variant: "destructive" });
    },
  });

  const handleCreateAssignment = () => {
    if (!selectedTeacherId || !selectedClassId || !selectedSubject) {
      toast({ title: tr.error, description: "Lütfen tüm alanları doldurun", variant: "destructive" });
      return;
    }

    createAssignmentMutation.mutate({
      teacherId: selectedTeacherId,
      classId: selectedClassId,
      subject: selectedSubject,
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm("Bu atamayı kaldırmak istediğinizden emin misiniz?")) {
      deleteAssignmentMutation.mutate(assignmentId);
    }
  };

  const handleCreateAttendance = () => {
    if (!selectedTeacherId) {
      toast({ title: tr.error, description: "Lütfen öğretmen seçin", variant: "destructive" });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    createAttendanceMutation.mutate({
      teacherId: selectedTeacherId,
      date: today,
      status: attendanceStatus,
      arrivalTime: arrivalTime || undefined,
      notes: sessionNotes || undefined,
    });
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'temel_bilgiler': return 'bg-blue-100 text-blue-800';
      case 'kuran': return 'bg-green-100 text-green-800';
      case 'ezber': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'temel_bilgiler': return tr.temelBilgiler;
      case 'kuran': return tr.kuran;
      case 'ezber': return tr.ezber;
      default: return subject;
    }
  };

  if (teachersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005C5C] mx-auto"></div>
            <p className="mt-2 text-[#005C5C]">{tr.loading}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#005C5C]">{tr.teacherManagement}</h1>
            <p className="text-[#7A7A7A] mt-1">Öğretmen atamalarını ve devamını yönetin</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#005C5C] hover:bg-[#004A4A] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {tr.assignTeacher}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FAF8F4]">
                <DialogHeader>
                  <DialogTitle className="text-[#005C5C]">{tr.teacherAssignments}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teacher">{tr.teacher}</Label>
                    <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Öğretmen seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="class">{tr.class}</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sınıf seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">{tr.subjects}</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ders seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temel_bilgiler">{tr.temelBilgiler}</SelectItem>
                        <SelectItem value="kuran">{tr.kuran}</SelectItem>
                        <SelectItem value="ezber">{tr.ezber}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateAssignment}
                    disabled={createAssignmentMutation.isPending}
                    className="w-full bg-[#005C5C] hover:bg-[#004A4A] text-white"
                  >
                    {createAssignmentMutation.isPending ? tr.loading : tr.assignTeacher}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#005C5C] text-[#005C5C] hover:bg-[#005C5C] hover:text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  {tr.teacherAttendance}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FAF8F4]">
                <DialogHeader>
                  <DialogTitle className="text-[#005C5C]">{tr.teacherAttendance}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teacher">{tr.teacher}</Label>
                    <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Öğretmen seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">{tr.attendanceStatus}</Label>
                    <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">{tr.present}</SelectItem>
                        <SelectItem value="absent">{tr.absent}</SelectItem>
                        <SelectItem value="late">Geç</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {attendanceStatus !== "absent" && (
                    <div>
                      <Label htmlFor="arrivalTime">{tr.arrivalTime}</Label>
                      <Input
                        type="time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="border-[#E5E5E5] focus:border-[#005C5C]"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="notes">{tr.sessionNotes}</Label>
                    <Input
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Ders notları (opsiyonel)"
                      className="border-[#E5E5E5] focus:border-[#005C5C]"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateAttendance}
                    disabled={createAttendanceMutation.isPending}
                    className="w-full bg-[#005C5C] hover:bg-[#004A4A] text-white"
                  >
                    {createAttendanceMutation.isPending ? tr.loading : tr.save}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-l-4 border-l-[#005C5C]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7A7A7A]">Toplam Öğretmen</p>
                  <p className="text-2xl font-bold text-[#005C5C]">{allTeachers.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#005C5C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7A7A7A]">Aktif Atamalar</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {teachers.reduce((acc, teacher) => acc + teacher.teacherSubjectAssignments.length, 0)}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7A7A7A]">Bugün Mevcut</p>
                  <p className="text-2xl font-bold text-green-600">
                    {teachers.filter(teacher => 
                      teacher.teacherAttendance.some(att => 
                        att.date === new Date().toISOString().split('T')[0] && att.status === 'present'
                      )
                    ).length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7A7A7A]">Bugün Yok</p>
                  <p className="text-2xl font-bold text-red-600">
                    {teachers.filter(teacher => 
                      teacher.teacherAttendance.some(att => 
                        att.date === new Date().toISOString().split('T')[0] && att.status === 'absent'
                      )
                    ).length}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Assignments Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-[#005C5C]">{tr.teacherAssignments}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tr.teacher}</TableHead>
                  <TableHead>{tr.class}</TableHead>
                  <TableHead>{tr.subjects}</TableHead>
                  <TableHead>Program Türü</TableHead>
                  <TableHead>Son Devam</TableHead>
                  <TableHead className="text-right">{tr.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  teacher.teacherSubjectAssignments.map((assignment, index) => (
                    <TableRow key={`${teacher.id}-${assignment.id}`}>
                      {index === 0 && (
                        <TableCell rowSpan={teacher.teacherSubjectAssignments.length || 1}>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-[#7A7A7A]">{teacher.email}</div>
                        </TableCell>
                      )}
                      <TableCell>{assignment.class.name}</TableCell>
                      <TableCell>
                        <Badge className={getSubjectColor(assignment.subject)}>
                          {getSubjectName(assignment.subject)}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.class.programType.name}</TableCell>
                      <TableCell>
                        {teacher.teacherAttendance.length > 0 ? (
                          <div className="text-sm">
                            <div>{teacher.teacherAttendance[0].date}</div>
                            <Badge variant={teacher.teacherAttendance[0].status === 'present' ? 'default' : 'destructive'}>
                              {teacher.teacherAttendance[0].status === 'present' ? 'Mevcut' : 'Yok'}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-[#7A7A7A]">Kayıt yok</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}