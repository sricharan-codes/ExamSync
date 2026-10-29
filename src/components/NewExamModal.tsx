import React, {useState} from 'react';
import {Exam, UserProfile} from '../types';
import {X, Calendar, Clock, MapPin, Users, BookOpen} from 'lucide-react';

interface NewExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExam: (exam: Exam) => void;
  staffUsers: UserProfile[];
}

export const NewExamModal: React.FC<NewExamModalProps> = ({
  isOpen,
  onClose,
  onAddExam,
  staffUsers,
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState('2026-10-23');
  const [timeSlot, setTimeSlot] = useState<Exam['timeSlot']>('Morning (09:30 AM - 12:30 PM)');
  const [venue, setVenue] = useState('Room 101');
  const [totalStudents, setTotalStudents] = useState(35);
  const [chiefInvigilatorId, setChiefInvigilatorId] = useState(staffUsers[0]?.id || '');
  const [department, setDepartment] = useState('Computer Science');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName) return;

    const newExam: Exam = {
      id: `ex-${Date.now()}`,
      courseCode,
      courseName,
      date,
      timeSlot,
      durationMinutes: 180,
      venue,
      totalStudents: Number(totalStudents),
      chiefInvigilatorId,
      status: 'Upcoming',
      department,
    };

    onAddExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Schedule New Examination</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-502"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence & Neural Networks"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Hall</label>
              <select
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Room 101">Room 101</option>
                <option value="Room 102">Room 102</option>
                <option value="Hall A">Hall A</option>
                <option value="Computer Lab 1">Computer Lab 1</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Morning (09:30 AM - 12:30 PM)">Morning (09:30 AM)</option>
                <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM)</option>
                <option value="Evening (06:00 PM - 09:00 PM)">Evening (06:00 PM)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Students</label>
              <input
                type="number"
                min="1"
                max="120"
                value={totalStudents}
                onChange={e => setTotalStudents(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Invigilator Assigned</label>
            <select
              value={chiefInvigilatorId}
              onChange={e => setChiefInvigilatorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {staffUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
              ))}
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
              Schedule Exam
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
