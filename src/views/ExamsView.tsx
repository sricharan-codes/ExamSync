import React, {useState} from 'react';
import {Exam, UserProfile} from '../types';
import {CalendarDays, Plus, Search, MapPin, Clock, Trash2, Filter} from 'lucide-react';

interface ExamsViewProps {
  exams: Exam[];
  onAddExamClick: () => void;
  onDeleteExam: (id: string) => void;
  staffUsers: UserProfile[];
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  onAddExamClick,
  onDeleteExam,
  staffUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900">Exam Scheduling & Timetable</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage course examinations, venues, time slots, and chief invigilators.</p>
        </div>
        <button
          onClick={onAddExamClick}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search course code, name, or venue..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Ongoing', 'Upcoming', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Course Details</th>
                <th className="px-6 py-3.5">Date & Time Slot</th>
                <th className="px-6 py-3.5">Venue</th>
                <th className="px-6 py-3.5">Students</th>
                <th className="px-6 py-3.5">Chief Invigilator</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredExams.map(exam => {
                const chief = staffUsers.find(u => u.id === exam.chiefInvigilatorId);
                return (
                  <tr key={exam.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {exam.courseCode}
                        </span>
                        <span className="font-bold text-slate-900">{exam.courseName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{exam.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{exam.date}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        <span>{exam.timeSlot}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-semibold">{exam.venue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {exam.totalStudents} Candidates
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{chief?.name || 'Unassigned'}</div>
                      <div className="text-[10px] text-slate-500">{chief?.department || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          exam.status === 'Ongoing'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : exam.status === 'Upcoming'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDeleteExam(exam.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No matching examinations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
