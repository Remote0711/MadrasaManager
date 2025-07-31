import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { tr } from "@/lib/tr";
import { Clock, User } from "lucide-react";
import type { StudentWithClass } from "@shared/schema";

interface AttendanceTrackerProps {
  students: StudentWithClass[];
}

type AttendanceStatus = 'geldi' | 'gelmedi' | 'mazeretli' | 'gec_geldi' | 'erken_cikti';

export default function AttendanceTracker({ students }: AttendanceTrackerProps) {
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithClass | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('geldi');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const attendanceMutation = useMutation({
    mutationFn: async (data: { 
      studentId: string; 
      week: number; 
      status: AttendanceStatus;
      arrivalTime?: string;
      departureTime?: string;
      notes?: string;
    }) => {
      const response = await apiRequest("POST", "/api/teacher/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: tr.success,
        description: tr.attendanceMarked,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/students'] });
      setTimeDialogOpen(false);
      setSelectedStudent(null);
      setArrivalTime('');
      setDepartureTime('');
      setNotes('');
    },
    onError: (error) => {
      console.error('Attendance error:', error);
      toast({
        title: tr.error,
        description: tr.attendanceMarkError,
        variant: "destructive",
      });
    },
  });

  const handleMarkAttendance = (studentId: string, status: AttendanceStatus) => {
    const currentWeek = Math.ceil((new Date().getTime() - new Date(2024, 8, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    if (status === 'gec_geldi' || status === 'erken_cikti') {
      const student = students.find(s => s.id === studentId);
      setSelectedStudent(student || null);
      setSelectedStatus(status);
      setTimeDialogOpen(true);
    } else {
      attendanceMutation.mutate({ studentId, week: currentWeek, status });
    }
  };

  const handleTimeSubmit = () => {
    if (!selectedStudent) return;
    
    const currentWeek = Math.ceil((new Date().getTime() - new Date(2024, 8, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    attendanceMutation.mutate({
      studentId: selectedStudent.id,
      week: currentWeek,
      status: selectedStatus,
      arrivalTime: selectedStatus === 'gec_geldi' ? arrivalTime : undefined,
      departureTime: selectedStatus === 'erken_cikti' ? departureTime : undefined,
      notes: notes || undefined,
    });
  };

  return (
    <>
      <div className="space-y-4">
        {students.slice(0, 10).map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#005C5C]" />
              <span className="text-sm font-medium text-gray-900">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div className="flex space-x-1">
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
                className="bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
                onClick={() => handleMarkAttendance(student.id, 'gec_geldi')}
                disabled={attendanceMutation.isPending}
              >
                {tr.lateArrival}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
                onClick={() => handleMarkAttendance(student.id, 'erken_cikti')}
                disabled={attendanceMutation.isPending}
              >
                {tr.earlyDeparture}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                onClick={() => handleMarkAttendance(student.id, 'mazeretli')}
                disabled={attendanceMutation.isPending}
              >
                {tr.excused}
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
            </div>
          </div>
        ))}
      </div>

      {/* Time Entry Dialog */}
      <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
        <DialogContent className="bg-[#FAF8F4]">
          <DialogHeader>
            <DialogTitle className="text-[#005C5C] flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {selectedStatus === 'gec_geldi' ? tr.lateArrival : tr.earlyDeparture} - {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatus === 'gec_geldi' && (
              <div>
                <Label htmlFor="arrivalTime">{tr.arrivalTime}</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="border-[#E5E5E5] focus:border-[#005C5C]"
                />
              </div>
            )}
            {selectedStatus === 'erken_cikti' && (
              <div>
                <Label htmlFor="departureTime">{tr.departureTime}</Label>
                <Input
                  id="departureTime"
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="border-[#E5E5E5] focus:border-[#005C5C]"
                />
              </div>
            )}
            <div>
              <Label htmlFor="notes">{tr.attendanceNotes}</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ek notlar (opsiyonel)"
                className="border-[#E5E5E5] focus:border-[#005C5C]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setTimeDialogOpen(false)}
                className="border-[#005C5C] text-[#005C5C]"
              >
                İptal
              </Button>
              <Button
                onClick={handleTimeSubmit}
                disabled={attendanceMutation.isPending || 
                  (selectedStatus === 'gec_geldi' && !arrivalTime) ||
                  (selectedStatus === 'erken_cikti' && !departureTime)
                }
                className="bg-[#005C5C] hover:bg-[#004A4A] text-white"
              >
                {attendanceMutation.isPending ? tr.loading : tr.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
