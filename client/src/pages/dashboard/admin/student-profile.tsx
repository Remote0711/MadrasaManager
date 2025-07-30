import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Users, Phone, Mail, Edit, ArrowLeft } from "lucide-react";
import { tr } from "@/lib/tr";
import type { Student, User as UserType } from "@shared/schema";
import { Link } from "wouter";

interface StudentWithDetails extends Student {
  class: {
    id: string;
    name: string;
    level: number;
    programType: {
      id: string;
      name: string;
      description: string | null;
    };
  };
  parent?: UserType;
}

function StudentProfile() {
  const [match, params] = useRoute("/dashboard/admin/students/:id");
  const studentId = params?.id;

  const { data: student, isLoading } = useQuery<StudentWithDetails>({
    queryKey: ["/api/admin/students", studentId],
    enabled: !!studentId,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Öğrenci Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız öğrenci mevcut değil.</p>
          <Link href="/dashboard/admin/students">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Öğrenci Listesine Dön
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belirtilmemiş";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/admin/students">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-600">Öğrenci Profili</p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Kişisel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ad</label>
                    <p className="text-lg font-semibold">{student.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Soyad</label>
                    <p className="text-lg font-semibold">{student.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doğum Tarihi</label>
                    <p className="text-lg">{formatDate(student.dateOfBirth)}</p>
                    {student.dateOfBirth && (
                      <p className="text-sm text-gray-500">
                        {calculateAge(student.dateOfBirth)} yaşında
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Kayıt Tarihi</label>
                    <p className="text-lg">{formatDate(student.enrollmentDate?.toString() || null)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Akademik Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sınıf</label>
                    <p className="text-lg font-semibold">{student.class.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Seviye</label>
                    <Badge variant="secondary">Seviye {student.class.level}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program Türü</label>
                    <Badge variant="outline">{student.class.programType.name}</Badge>
                  </div>
                </div>
                {student.class.programType.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program Açıklaması</label>
                    <p className="text-gray-700">{student.class.programType.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Veli Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.parent ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Veli Adı</label>
                      <p className="text-lg font-semibold">{student.parent.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kullanıcı Adı</label>
                      <p className="text-gray-700">{student.parent.username}</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Mesaj Gönder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 mb-3">Veli atanmamış</p>
                    <Button variant="outline" size="sm">
                      Veli Ata
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Devam Kayıtları
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  İlerleme Raporları
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Davranış Notları
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default StudentProfile;