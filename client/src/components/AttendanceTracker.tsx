import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import type { StudentWithClass } from "@shared/schema";

interface AttendanceTrackerProps {
  students: StudentWithClass[];
}

export default function AttendanceTracker({ students }: AttendanceTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const attendanceMutation = useMutation({
    mutationFn: async (data: { studentId: string; week: number; status: 'geldi' | 'gelmedi' | 'mazeretli' }) => {
      const response = await apiRequest("POST", "/api/teacher/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: tr.success,
        description: tr.attendanceMarked,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
    },
    onError: () => {
      toast({
        title: tr.error,
        description: tr.attendanceMarkError,
        variant: "destructive",
      });
    },
  });

  const handleMarkAttendance = (studentId: string, status: 'geldi' | 'gelmedi' | 'mazeretli') => {
    const currentWeek = 5; // This would normally be calculated
    attendanceMutation.mutate({ studentId, week: currentWeek, status });
  };

  return (
    <div className="space-y-4">
      {students.slice(0, 10).map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
              onClick={() => handleMarkAttendance(student.id, 'geldi')}
              disabled={attendanceMutation.isPending}
            >
              {tr.present}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
              onClick={() => handleMarkAttendance(student.id, 'gelmedi')}
              disabled={attendanceMutation.isPending}
            >
              {tr.absent}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
              onClick={() => handleMarkAttendance(student.id, 'mazeretli')}
              disabled={attendanceMutation.isPending}
            >
              {tr.excused}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
