import React, {useState} from 'react';
import {InvigilationDuty, Exam, UserProfile} from '../types';
import {X, Users, Clock, MapPin} from 'lucide-react';

interface NewDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDuty: (duty: InvigilationDuty) => void;
  exams: Exam[];
  staffUsers: UserProfile[];
}

export const NewDutyModal: React.FC<NewDutyModalProps> = ({
  isOpen,
  onClose,
  onAddDuty,
  exams,
  staffUsers,
}) => {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [selectedFacultyId, setSelectedFacultyId] = useState(staffUsers[0]?.id || '');
  const [dutyType, setDutyType] = useState<InvigilationDuty['dutyType']>('Invigilator');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exam = exams.find(ex => ex.id === selectedExamId);
    const faculty = staffUsers.find(u => u.id === selectedFacultyId);
    if (!exam || !faculty) return;

    const newDuty: InvigilationDuty = {
      id: `duty-${Date.now()}`,
      examId: exam.id,
      courseCode: exam.courseCode,
      courseName: exam.courseName,
      venue: exam.venue,
      date: exam.date,
      timeSlot: exam.timeSlot,
      facultyId: faculty.id,
      facultyName: faculty.name,
      department: faculty.department,
      dutyType,
      checkInStatus: 'Pending',
    };

    onAddDuty(newDuty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Assign Custom Invigilation Duty</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Examination</label>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.courseCode} - {ex.courseName} ({ex.venue})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Faculty Member</label>
            <select
              value={selectedFacultyId}
              onChange={e => setSelectedFacultyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {staffUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duty Role</label>
            <select
              value={dutyType}
              onChange={e => setDutyType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option value="Chief Invigilator">Chief Invigilator</option>
              <option value="Invigilator">Invigilator</option>
              <option value="Relieving Staff">Relieving Staff</option>
              <option value="Flying Squad">Flying Squad</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md"
            >
              Assign Duty
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
