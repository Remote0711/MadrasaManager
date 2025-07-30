import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import { tr } from "@/lib/tr";
import type { ParentWithStudent, Progress } from "@shared/schema";

export default function ParentDashboard() {
  const { data: parentData, isLoading: parentLoading } = useQuery<ParentWithStudent>({
    queryKey: ['/api/parent/child'],
  });

  const { data: progressHistory = [], isLoading: progressLoading } = useQuery<Progress[]>({
    queryKey: ['/api/student', parentData?.student.id, 'progress'],
    enabled: !!parentData?.student.id,
  });

  if (parentLoading || progressLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!parentData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">{tr.childInfoNotFound}</h2>
          <p className="text-gray-600 mt-2">{tr.contactAdmin}</p>
        </div>
      </Layout>
    );
  }

  const child = parentData.student;
  
  // Calculate progress statistics
  const totalPages = progressHistory.reduce((sum, p) => sum + p.pagesPlanned, 0);
  const completedPages = progressHistory.reduce((sum, p) => sum + p.pagesDone, 0);
  const overallProgress = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

  // Mock attendance data - in real app this would come from API
  const attendanceStats = {
    present: 19,
    absent: 1,
    excused: 0,
    rate: 95,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tr.parentDashboard}</h1>
        </div>

        {/* Child Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{tr.myChild}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-semibold text-gray-900">
                  {child.firstName} {child.lastName}
                </h4>
                <p className="text-gray-600">{child.class.name} Sınıfı</p>
                <p className="text-sm text-gray-500">{child.class.programType.name} Programı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress and Attendance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>{tr.progressStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-300"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${overallProgress >= 90 ? 'text-green-500' : overallProgress >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${overallProgress}, 100`}
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                  </div>
                </div>
                <p className="text-gray-600">{tr.overallProgress}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{tr.completedPages}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {completedPages} / {totalPages}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{tr.currentWeek}</span>
                  <span className="text-sm font-medium text-gray-900">Hafta 5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{tr.status}</span>
                  <Badge className={overallProgress >= 90 ? 'bg-green-100 text-green-800' : overallProgress >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {overallProgress >= 90 ? tr.successful : overallProgress >= 50 ? tr.improving : tr.needsAttention}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card>
            <CardHeader>
              <CardTitle>{tr.attendance}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">{attendanceStats.rate}%</div>
                <p className="text-gray-600">{tr.attendanceRate}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <div className="text-xs text-gray-500">{tr.present}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <div className="text-xs text-gray-500">{tr.absent}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{attendanceStats.excused}</div>
                  <div className="text-xs text-gray-500">{tr.excused}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Progress History */}
        <Card>
          <CardHeader>
            <CardTitle>{tr.recentProgressRecords}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.week}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.completed}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.planned}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tr.rate}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {progressHistory.slice(0, 5).map((record) => {
                    const percentage = Math.round((record.pagesDone / record.pagesPlanned) * 100);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Hafta {record.week}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.pagesDone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.pagesPlanned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ProgressBar percentage={percentage} showText />
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
    </Layout>
  );
}
