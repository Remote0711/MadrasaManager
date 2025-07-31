import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Users, BookOpen, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { Class, User, TeacherWithAssignments } from "@shared/schema";

const studentRegistrationSchema = z.object({
  firstName: z.string().min(1, "Ad zorunludur"),
  lastName: z.string().min(1, "Soyad zorunludur"),
  dateOfBirth: z.string().optional(),
  parentId: z.string().optional(),
  classId: z.string().min(1, "Sınıf seçimi zorunludur"),
});

const parentSchema = z.object({
  userId: z.string().min(1, "Veli seçimi zorunludur"),
});

type StudentFormData = z.infer<typeof studentRegistrationSchema>;
type ParentFormData = z.infer<typeof parentSchema>;

export default function StudentRegistration() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectTeachers, setSubjectTeachers] = useState<Record<string, string>>({});
  const [createParent, setCreateParent] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['/api/admin/classes'],
  });

  const { data: parents = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/parents'],
  });

  const { data: teachers = [] } = useQuery<TeacherWithAssignments[]>({
    queryKey: ['/api/admin/teacher-assignments'],
  });

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      parentId: "",
      classId: "",
    },
  });

  const parentForm = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      userId: "",
    },
  });

  const registerStudentMutation = useMutation({
    mutationFn: async (data: {
      studentData: StudentFormData;
      subjectEnrollments: Array<{
        classId: string;
        subject: string;
        teacherId?: string;
      }>;
      parentData?: { userId: string };
    }) => {
      const response = await apiRequest("POST", "/api/admin/students/register", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/students'] });
      studentForm.reset();
      parentForm.reset();
      setSelectedSubjects([]);
      setSubjectTeachers({});
      setCreateParent(false);
      toast({ title: tr.success, description: "Öğrenci başarıyla kaydedildi" });
    },
    onError: () => {
      toast({ title: tr.error, description: "Öğrenci kaydedilirken hata oluştu", variant: "destructive" });
    },
  });

  const onSubmit = (data: StudentFormData) => {
    const parentData = createParent ? parentForm.getValues() : undefined;
    
    const subjectEnrollments = selectedSubjects.map(subject => ({
      classId: data.classId,
      subject,
      teacherId: subjectTeachers[subject] || undefined,
    }));

    registerStudentMutation.mutate({
      studentData: data,
      subjectEnrollments,
      parentData,
    });
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      const newTeachers = { ...subjectTeachers };
      delete newTeachers[subject];
      setSubjectTeachers(newTeachers);
    }
  };

  const handleTeacherChange = (subject: string, teacherId: string) => {
    setSubjectTeachers({
      ...subjectTeachers,
      [subject]: teacherId,
    });
  };

  const getAvailableTeachers = (subject: string) => {
    return teachers.filter(teacher =>
      teacher.teacherSubjectAssignments.some(assignment =>
        assignment.subject === subject && assignment.classId === studentForm.watch('classId')
      )
    );
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'temel_bilgiler': return tr.temelBilgiler;
      case 'kuran': return tr.kuran;
      case 'ezber': return tr.ezber;
      default: return subject;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#005C5C]">{tr.studentRegistration}</h1>
            <p className="text-[#7A7A7A] mt-1">Yeni öğrenci kaydı oluşturun ve derslere kaydedin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information Form */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-[#005C5C] flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Öğrenci Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={studentForm.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{tr.firstName}</Label>
                    <Input
                      {...studentForm.register("firstName")}
                      placeholder={tr.firstNamePlaceholder}
                      className="border-[#E5E5E5] focus:border-[#005C5C]"
                    />
                    {studentForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {studentForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{tr.lastName}</Label>
                    <Input
                      {...studentForm.register("lastName")}
                      placeholder={tr.lastNamePlaceholder}
                      className="border-[#E5E5E5] focus:border-[#005C5C]"
                    />
                    {studentForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {studentForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">{tr.dateOfBirth}</Label>
                    <Input
                      type="date"
                      {...studentForm.register("dateOfBirth")}
                      className="border-[#E5E5E5] focus:border-[#005C5C]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classId">{tr.class}</Label>
                    <Select
                      value={studentForm.watch("classId")}
                      onValueChange={(value) => studentForm.setValue("classId", value)}
                    >
                      <SelectTrigger className="border-[#E5E5E5] focus:border-[#005C5C]">
                        <SelectValue placeholder={tr.selectClass} />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {studentForm.formState.errors.classId && (
                      <p className="text-red-500 text-sm mt-1">
                        {studentForm.formState.errors.classId.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Parent Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#005C5C] mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {tr.parentInformation}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createParent"
                        checked={createParent}
                        onCheckedChange={setCreateParent}
                      />
                      <Label htmlFor="createParent">Veli bağlantısı oluştur</Label>
                    </div>
                    
                    {createParent && (
                      <div>
                        <Label htmlFor="parentId">Veli</Label>
                        <Select
                          value={parentForm.watch("userId")}
                          onValueChange={(value) => parentForm.setValue("userId", value)}
                        >
                          <SelectTrigger className="border-[#E5E5E5] focus:border-[#005C5C]">
                            <SelectValue placeholder="Veli seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {parents.map((parent) => (
                              <SelectItem key={parent.id} value={parent.id}>
                                {parent.name} ({parent.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Subject Enrollment */}
                <div>
                  <h3 className="text-lg font-semibold text-[#005C5C] mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {tr.subjectEnrollment}
                  </h3>
                  <div className="space-y-4">
                    {['temel_bilgiler', 'kuran', 'ezber'].map((subject) => (
                      <div key={subject} className="border rounded-lg p-4 bg-[#FAF8F4]">
                        <div className="flex items-center space-x-2 mb-3">
                          <Checkbox
                            id={subject}
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                          />
                          <Label htmlFor={subject} className="font-medium">
                            {getSubjectName(subject)}
                          </Label>
                        </div>
                        
                        {selectedSubjects.includes(subject) && studentForm.watch('classId') && (
                          <div className="ml-6">
                            <Label className="text-sm">{tr.assignedTeacher}</Label>
                            <Select
                              value={subjectTeachers[subject] || ""}
                              onValueChange={(value) => handleTeacherChange(subject, value)}
                            >
                              <SelectTrigger className="border-[#E5E5E5] focus:border-[#005C5C]">
                                <SelectValue placeholder="Öğretmen seçin (opsiyonel)" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableTeachers(subject).map((teacher) => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={registerStudentMutation.isPending}
                  className="w-full bg-[#005C5C] hover:bg-[#004A4A] text-white"
                >
                  {registerStudentMutation.isPending ? tr.loading : "Öğrenciyi Kaydet"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Registration Summary */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-[#005C5C] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Kayıt Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#7A7A7A]">Öğrenci Adı</p>
                <p className="font-medium">
                  {studentForm.watch("firstName")} {studentForm.watch("lastName")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-[#7A7A7A]">Sınıf</p>
                <p className="font-medium">
                  {classes.find(c => c.id === studentForm.watch("classId"))?.name || "Seçilmedi"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-[#7A7A7A]">Seçilen Dersler</p>
                <div className="space-y-1 mt-1">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map(subject => (
                      <div key={subject} className="text-sm">
                        <span className="font-medium">{getSubjectName(subject)}</span>
                        {subjectTeachers[subject] && (
                          <span className="text-[#7A7A7A] ml-2">
                            - {teachers.find(t => t.id === subjectTeachers[subject])?.name}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#7A7A7A]">Henüz ders seçilmedi</p>
                  )}
                </div>
              </div>
              
              {createParent && (
                <div>
                  <p className="text-sm text-[#7A7A7A]">Veli</p>
                  <p className="font-medium">
                    {parents.find(p => p.id === parentForm.watch("userId"))?.name || "Seçilmedi"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}