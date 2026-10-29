import React from 'react';
import {SosAlert, IncidentReport} from '../types';
import {ShieldAlert, AlertTriangle, CheckCircle2, Clock, MapPin, FileText, Plus} from 'lucide-react';

interface AlertsViewProps {
  sosAlerts: SosAlert[];
  incidentReports: IncidentReport[];
  onAcknowledgeSos: (id: string) => void;
  onResolveSos: (id: string) => void;
  onOpenSosModal: () => void;
  onOpenNewIncidentModal: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  sosAlerts,
  incidentReports,
  onAcknowledgeSos,
  onResolveSos,
  onOpenSosModal,
  onOpenNewIncidentModal,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900">Emergency SOS & Incident Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time tracking of emergency alerts, malpractice reports, and rapid response resolution.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewIncidentModal}
            className="bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Log Custom Incident</span>
          </button>
          <button
            onClick={onOpenSosModal}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* SOS Alerts Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Active Emergency SOS Alerts</span>
            </h2>
            <p className="text-xs text-slate-500">Immediate action required for active examination emergencies</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
            {sosAlerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged').length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sosAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition ${
                alert.status === 'Resolved'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-rose-50/70 border-rose-200 shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{alert.alertType}</h3>
                    <span className="text-[10px] text-indigo-700 font-semibold flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.venue}</span>
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    alert.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : alert.status === 'Acknowledged'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}
                >
                  {alert.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 mt-3 leading-relaxed">{alert.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Reported by: <strong className="text-slate-900">{alert.reportedBy}</strong></span>
                <div className="flex space-x-2">
                  {alert.status === 'Active' && (
                    <button
                      onClick={() => onAcknowledgeSos(alert.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => onResolveSos(alert.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {sosAlerts.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
              No active SOS alerts.
            </div>
          )}
        </div>
      </div>

      {/* Incident Reports Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Malpractice & Incident Logs</span>
            </h2>
            <p className="text-xs text-slate-500">Recorded candidate incidents during examination sessions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Course & Venue</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5">Reported By</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {incidentReports.map(inc => (
                <tr key={inc.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{inc.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{inc.studentRollNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{inc.courseCode}</div>
                    <div className="text-[10px] text-indigo-600">{inc.venue}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {inc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-700">
                    {inc.details}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {inc.reportedBy}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {incidentReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No incident reports logged.
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
