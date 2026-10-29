import React from 'react';
import {Exam, RoomLayout, InvigilationDuty} from '../types';
import {BarChart3, Download, Users, CheckCircle2, Building, Award, Printer} from 'lucide-react';

interface ReportsViewProps {
  exams: Exam[];
  roomLayouts: Record<string, RoomLayout>;
  duties: InvigilationDuty[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  exams,
  roomLayouts,
  duties,
}) => {
  let totalSeated = 0;
  let totalAbsent = 0;
  let totalFlagged = 0;

  Object.values(roomLayouts).forEach(room => {
    room.seats.forEach(s => {
      if (s.status === 'seated') totalSeated++;
      if (s.status === 'absent') totalAbsent++;
      if (s.status === 'flagged_malpractice') totalFlagged++;
    });
  });

  const totalCandidates = totalSeated + totalAbsent + totalFlagged;
  const attendanceRate = totalCandidates > 0 ? ((totalSeated + totalFlagged) / totalCandidates * 100).toFixed(1) : '100';

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900">Reports & Examination Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive institutional statistics, hall occupancy metrics, and exportable audit reports.</p>
        </div>
        <button
          onClick={handlePrintReport}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF Report</span>
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{attendanceRate}%</div>
          <div className="text-[10px] text-slate-500 mt-1">{totalSeated} present out of {totalCandidates} registered</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Venues Active</span>
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{Object.keys(roomLayouts).length} Halls</div>
          <div className="text-[10px] text-slate-500 mt-1">Full capacity seating utilized</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Deployed</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{duties.length} Staff</div>
          <div className="text-[10px] text-slate-500 mt-1">Chief invigilators & flying squad</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Malpractice Flags</span>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{totalFlagged} Cases</div>
          <div className="text-[10px] text-slate-500 mt-1">Logged and escalated to disciplinary committee</div>
        </div>
      </div>

      {/* Hall Occupancy Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Hall Occupancy & Capacity Summary</h2>
        <div className="space-y-4">
          {Object.entries(roomLayouts).map(([venueName, room]) => {
            const total = room.seats.length;
            const present = room.seats.filter(s => s.status === 'seated' || s.status === 'flagged_malpractice').length;
            const pct = total > 0 ? Math.round((present / total) * 100) : 0;

            return (
              <div key={venueName} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{venueName}</span>
                    <span className="text-xs text-slate-500 ml-2">({room.building})</span>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600">
                    {present} / {total} Seated ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500" style={{width: `${pct}%`}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
