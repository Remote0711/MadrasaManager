import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StudentForm from "@/components/StudentForm";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { tr } from "@/lib/tr";
import type { StudentWithClass } from "@shared/schema";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const { data: students = [], isLoading } = useQuery<StudentWithClass[]>({
    queryKey: ['/api/admin/students'],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Get unique classes for filter
  const classes = Array.from(new Set(students.map(s => s.class.name))).sort();

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class.name === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getProgramBadgeColor = (programName: string) => {
    switch (programName) {
      case 'Haftasonu':
        return 'bg-green-100 text-green-800';
      case 'Yatılı':
        return 'bg-blue-100 text-blue-800';
      case 'Yetişkin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{tr.studentManagement}</h1>
          <StudentForm />
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{tr.studentList}</CardTitle>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <div className="flex items-center space-x-4">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tr.allClasses}</SelectItem>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={tr.searchStudent}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 w-64"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
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
                      {tr.class}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.program}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.progress}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.createdAt}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => {
                    // Mock progress for demonstration - in real app this would come from API
                    const progressPercentage = Math.floor(Math.random() * 40) + 50; // 50-90%
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {student.firstName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">#{student.id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.class.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getProgramBadgeColor(student.class.programType.name)}>
                            {student.class.programType.name}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ProgressBar percentage={progressPercentage} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm || selectedClass !== "all" ? tr.noStudentsFound : tr.noStudents}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedClass !== "all" ? tr.tryDifferentSearch : tr.noStudentsDescription}
                </p>
              </div>
            )}
            
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                  {tr.totalStudents}: {filteredStudents.length}
                </span>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {tr.showing} <span className="font-medium">{filteredStudents.length}</span> {tr.ofTotal} <span className="font-medium">{students.length}</span> {tr.students}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
