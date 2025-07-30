import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GraduationCap, Plus, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { tr } from "@/lib/tr";
import type { Student } from "@shared/schema";
import AddStudentDialog from "@/components/forms/AddStudentDialog";

interface StudentWithRelations extends Student {
  class?: {
    id: string;
    name: string;
    programType?: {
      id: string;
      name: string;
    };
  };
}

export default function AdminStudents() {
  const { data: students, isLoading } = useQuery<StudentWithRelations[]>({
    queryKey: ['/api/admin/students'],
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
          <div>
            <h1 className="text-3xl font-bold">{tr.students}</h1>
            <p className="text-muted-foreground">
              Öğrenci kayıtlarını yönetin
            </p>
          </div>
          <AddStudentDialog />
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Öğrenci Listesi ({students?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Ad Soyad</th>
                    <th className="text-left py-3 px-4">Sınıf</th>
                    <th className="text-left py-3 px-4">Program</th>
                    <th className="text-left py-3 px-4">Kayıt Tarihi</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{student.firstName} {student.lastName}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.class?.name || 'Atanmamış'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {student.class?.programType?.name || 'Belirsiz'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(student.enrollmentDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Aktif
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">İşlemleri aç</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}