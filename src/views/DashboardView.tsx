import React from 'react';
import {Exam, SosAlert, InvigilationDuty, RoomLayout} from '../types';
import {CalendarDays, Users, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight, Radio, Clock, Building, MapPin} from 'lucide-react';

interface DashboardViewProps {
  exams: Exam[];
  sosAlerts: SosAlert[];
  duties: InvigilationDuty[];
  roomLayouts: Record<string, RoomLayout>;
  onNavigate: (tab: string) => void;
  onOpenSosModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  sosAlerts,
  duties,
  roomLayouts,
  onNavigate,
  onOpenSosModal,
}) => {
  const ongoingExams = exams.filter(e => e.status === 'Ongoing');
  const upcomingExams = exams.filter(e => e.status === 'Upcoming');
  const activeSos = sosAlerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged');
  const checkedInDuties = duties.filter(d => d.checkInStatus === 'Checked-In');

  let totalSeatedCount = 0;
  let totalAbsentCount = 0;
  Object.values(roomLayouts).forEach(room => {
    room.seats.forEach(seat => {
      if (seat.status === 'seated' || seat.status === 'flagged_malpractice') totalSeatedCount++;
      if (seat.status === 'absent') totalAbsentCount++;
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 rounded-2xl border border-indigo-200 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Examination Session Active</span>
            </span>
            <span className="text-xs text-indigo-200 font-mono">Date: Oct 22, 2026</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2 tracking-tight">
            ExamSync Pro Command Center
          </h1>
          <p className="text-xs text-indigo-100 mt-1 max-w-2xl">
            Real-time coordination of seating arrangements, invigilation duties, instant faculty communication, and emergency alerts.
            Admins: <strong className="text-white underline">laxmisricharank@gmail.com</strong>, <strong className="text-white underline">babecanikissu7@gmail.com</strong>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('faculty')}
            className="bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-400/40 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-indigo-200" />
            <span>Faculty Registry</span>
          </button>
          <button
            onClick={() => onNavigate('seating')}
            className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Building className="w-4 h-4 text-indigo-700" />
            <span>Seating Engine</span>
          </button>
          <button
            onClick={onOpenSosModal}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger SOS</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ongoing Exams</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{ongoingExams.length}</span>
            <span className="text-xs text-indigo-600 font-medium">/{exams.length} Total Scheduled</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
            <span className="text-emerald-600 font-semibold">{upcomingExams.length} upcoming</span> in afternoon session
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidates Seated</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{totalSeatedCount}</span>
            <span className="text-xs text-rose-600 font-medium">{totalAbsentCount} Absent</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
            <span>96.4% overall attendance rate</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invigilators On Duty</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{checkedInDuties.length}</span>
            <span className="text-xs text-purple-600 font-medium">/{duties.length} Assigned</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            <span>All biometric check-ins verified</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active SOS / Incidents</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{activeSos.length}</span>
            <span className="text-xs text-rose-600 font-medium">Requires Attention</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            <span>Flying squad dispatched</span>
          </div>
        </div>

      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ongoing Exams Live Status */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ongoing Examination Halls</h2>
              <p className="text-xs text-slate-500">Real-time monitoring of student seating, time elapsed, and invigilators</p>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Exams</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {ongoingExams.map(exam => (
              <div key={exam.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {exam.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{exam.venue}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{exam.courseName}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      <span>{exam.timeSlot.split(' ')[0]} Slot</span>
                    </span>
                    <span>•</span>
                    <span>{exam.totalStudents} Students Enrolled</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onNavigate('seating')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Seating Map
                  </button>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Hall Comms
                  </button>
                </div>
              </div>
            ))}
            {ongoingExams.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No exams currently ongoing. Check schedule for upcoming sessions.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active SOS / Incidents Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Emergency SOS Feed</h2>
              <p className="text-xs text-slate-500">Live alerts from invigilators</p>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage SOS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {sosAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                No emergency alerts recorded. All exam halls operating smoothly.
              </div>
            ) : (
              sosAlerts.map(alert => (
                <div key={alert.id} className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-1.5 text-rose-700 font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{alert.alertType}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{alert.description}</p>
                  <div className="mt-2 pt-2 border-t border-rose-200 flex justify-between items-center text-[10px] text-slate-500">
                    <span className="text-indigo-700 font-semibold">{alert.venue}</span>
                    <span>Reported by {alert.reportedBy}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
