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
  // Track multiple attendance statuses for each student to show visual feedback
  const [studentAttendanceStatus, setStudentAttendanceStatus] = useState<Record<string, Set<AttendanceStatus>>>({});
  
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
    onSuccess: (_, variables) => {
      // Update local state to show visual feedback
      setStudentAttendanceStatus(prev => {
        const currentStatuses = prev[variables.studentId] || new Set();
        const newStatuses = new Set(currentStatuses);
        
        // Handle mutually exclusive statuses
        if (variables.status === 'gelmedi') {
          // If absent, clear all other statuses
          newStatuses.clear();
          newStatuses.add('gelmedi');
        } else if (variables.status === 'geldi') {
          // If present, remove absent and add present
          newStatuses.delete('gelmedi');
          newStatuses.add('geldi');
        } else {
          // For other statuses (late, early departure, excused), add to existing
          newStatuses.delete('gelmedi'); // Can't be absent if they have other statuses
          newStatuses.add('geldi'); // Must be present to have other statuses
          newStatuses.add(variables.status);
        }
        
        return {
          ...prev,
          [variables.studentId]: newStatuses
        };
      });
      
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
    
    // Immediately update visual state for feedback
    setStudentAttendanceStatus(prev => {
      const currentStatuses = prev[studentId] || new Set();
      const newStatuses = new Set(currentStatuses);
      
      // Handle mutually exclusive statuses
      if (status === 'gelmedi') {
        // If absent, clear all other statuses
        newStatuses.clear();
        newStatuses.add('gelmedi');
      } else if (status === 'geldi') {
        // If present, remove absent and add present
        newStatuses.delete('gelmedi');
        newStatuses.add('geldi');
      } else {
        // For other statuses (late, early departure, excused), add to existing
        newStatuses.delete('gelmedi'); // Can't be absent if they have other statuses
        newStatuses.add('geldi'); // Must be present to have other statuses
        newStatuses.add(status);
      }
      
      return {
        ...prev,
        [studentId]: newStatuses
      };
    });
    
    if (status === 'gec_geldi' || status === 'erken_cikti') {
      const student = students.find(s => s.id === studentId);
      setSelectedStudent(student || null);
      setSelectedStatus(status);
      setTimeDialogOpen(true);
    } else {
      attendanceMutation.mutate({ studentId, week: currentWeek, status });
    }
  };

  // Helper function to get button style based on status
  const getButtonStyle = (studentId: string, status: AttendanceStatus) => {
    const studentStatuses = studentAttendanceStatus[studentId] || new Set<AttendanceStatus>();
    const isSelected = studentStatuses.has && studentStatuses.has(status);
    const baseClasses = "flex-1 text-sm py-2 px-3 rounded-md transition-all duration-200 font-medium";
    
    switch (status) {
      case 'geldi':
        return `${baseClasses} ${isSelected 
          ? 'bg-green-600 text-white shadow-lg border-2 border-green-700' 
          : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
        }`;
      case 'gec_geldi':
        return `${baseClasses} ${isSelected 
          ? 'bg-yellow-600 text-white shadow-lg border-2 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
        }`;
      case 'erken_cikti':
        return `${baseClasses} ${isSelected 
          ? 'bg-orange-600 text-white shadow-lg border-2 border-orange-700' 
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
        }`;
      case 'mazeretli':
        return `${baseClasses} ${isSelected 
          ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-700' 
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
        }`;
      case 'gelmedi':
        return `${baseClasses} ${isSelected 
          ? 'bg-red-600 text-white shadow-lg border-2 border-red-700' 
          : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
        }`;
      default:
        return baseClasses;
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
      <div className="space-y-3">
        {students.map((student) => (
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
            <div className="flex gap-1">
              <button
                className={getButtonStyle(student.id, 'geldi')}
                onClick={() => handleMarkAttendance(student.id, 'geldi')}
                disabled={attendanceMutation.isPending}
              >
                ✓ {tr.present}
              </button>
              <button
                className={getButtonStyle(student.id, 'gec_geldi')}
                onClick={() => handleMarkAttendance(student.id, 'gec_geldi')}
                disabled={attendanceMutation.isPending}
              >
                ⏰ {tr.lateArrival}
              </button>
              <button
                className={getButtonStyle(student.id, 'erken_cikti')}
                onClick={() => handleMarkAttendance(student.id, 'erken_cikti')}
                disabled={attendanceMutation.isPending}
              >
                ⏰ {tr.earlyDeparture}
              </button>
              <button
                className={getButtonStyle(student.id, 'mazeretli')}
                onClick={() => handleMarkAttendance(student.id, 'mazeretli')}
                disabled={attendanceMutation.isPending}
              >
                📋 {tr.excused}
              </button>
              <button
                className={getButtonStyle(student.id, 'gelmedi')}
                onClick={() => handleMarkAttendance(student.id, 'gelmedi')}
                disabled={attendanceMutation.isPending}
              >
                ✗ {tr.absent}
              </button>
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
