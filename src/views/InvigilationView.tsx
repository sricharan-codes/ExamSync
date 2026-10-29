import React, {useState} from 'react';
import {InvigilationDuty, UserProfile, Exam} from '../types';
import {Users, Calendar, CheckCircle2, Clock, Sparkles, UserCheck} from 'lucide-react';

interface InvigilationViewProps {
  duties: InvigilationDuty[];
  staffUsers: UserProfile[];
  exams: Exam[];
  onCheckInDuty: (dutyId: string) => void;
  onAutoAssignDuties: () => void;
  onOpenNewDutyModal: () => void;
}

export const InvigilationView: React.FC<InvigilationViewProps> = ({
  duties,
  staffUsers,
  exams,
  onCheckInDuty,
  onAutoAssignDuties,
  onOpenNewDutyModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredDuties = duties.filter(d => {
    if (filterStatus === 'All') return true;
    return d.checkInStatus === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900">Invigilation Allocation & Duties</h1>
          <p className="text-xs text-slate-500 mt-0.5">Automated fair faculty allocation, duty schedules, and biometric check-in tracking.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewDutyModal}
            className="bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Add Custom Duty</span>
          </button>
          <button
            onClick={onAutoAssignDuties}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer border border-indigo-500/30"
          >
            <Sparkles className="w-4 h-4 text-indigo-100" />
            <span>Auto-Assign Fair Duties</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Duties Scheduled</div>
          <div className="text-2xl font-black text-slate-900 mt-2">{duties.length}</div>
          <div className="text-[10px] text-indigo-600 mt-1">Across all active & upcoming exam halls</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Checked-In Verified</div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {duties.filter(d => d.checkInStatus === 'Checked-In').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Biometric / manual verification confirmed</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Check-Ins</div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {duties.filter(d => d.checkInStatus === 'Pending').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">For afternoon and evening sessions</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 mr-2">Filter Status:</span>
        {['All', 'Checked-In', 'Pending', 'Absent'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterStatus === st ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Duties Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Faculty Member</th>
                <th className="px-6 py-3.5">Exam & Course</th>
                <th className="px-6 py-3.5">Venue & Slot</th>
                <th className="px-6 py-3.5">Duty Type</th>
                <th className="px-6 py-3.5">Check-In Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredDuties.map(duty => {
                const faculty = staffUsers.find(u => u.id === duty.facultyId);
                return (
                  <tr key={duty.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={faculty?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                          alt={duty.facultyName}
                          className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{duty.facultyName}</div>
                          <div className="text-[10px] text-slate-500">{duty.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {duty.courseCode}
                        </span>
                        <span className="font-semibold text-slate-900">{duty.courseName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{duty.venue}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        <span>{duty.timeSlot}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {duty.dutyType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          duty.checkInStatus === 'Checked-In'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : duty.checkInStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {duty.checkInStatus} {duty.checkInTime ? `(${duty.checkInTime})` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {duty.checkInStatus === 'Pending' ? (
                        <button
                          onClick={() => onCheckInDuty(duty.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow cursor-pointer"
                        >
                          Verify Check-In
                        </button>
                      ) : (
                        <span className="text-emerald-600 text-xs font-semibold flex items-center justify-end space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
