import React, {useState} from 'react';
import {SosAlert, UserProfile} from '../types';
import {X, ShieldAlert, AlertTriangle} from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSos: (alert: SosAlert) => void;
  currentUser: UserProfile;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onTriggerSos,
  currentUser,
}) => {
  const [venue, setVenue] = useState('Room 101');
  const [alertType, setAlertType] = useState<SosAlert['alertType']>('Medical Emergency');
  const [priority, setPriority] = useState<SosAlert['priority']>('High');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newAlert: SosAlert = {
      id: `sos-${Date.now()}`,
      venue,
      reportedBy: currentUser.name,
      facultyId: currentUser.id,
      alertType,
      description,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      status: 'Active',
      priority,
    };

    onTriggerSos(newAlert);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-rose-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-rose-100 flex justify-between items-center bg-rose-50">
          <div className="flex items-center space-x-2 text-rose-700">
            <ShieldAlert className="w-5 h-5 animate-bounce" />
            <h3 className="font-bold text-slate-900 text-base">Trigger Emergency SOS</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800">
              Immediate broadcast will be dispatched to the Exam Controller office, Flying Squad, and hall invigilators. Use only for genuine emergencies.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Venue / Hall</label>
            <select
              value={venue}
              onChange={e => setVenue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="Room 101">Room 101</option>
              <option value="Room 102">Room 102</option>
              <option value="Hall A">Hall A</option>
              <option value="Computer Lab 1">Computer Lab 1</option>
              <option value="Auditorium">Auditorium</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Type</label>
              <select
                value={alertType}
                onChange={e => setAlertType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
              >
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Question Paper Issue">Question Paper Issue</option>
                <option value="Disruptive Behavior">Disruptive Behavior / Malpractice</option>
                <option value="Technical/Power Failure">Technical / Power Failure</option>
                <option value="Other">Other Urgent Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
              >
                <option value="Critical">Critical (Immediate Action)</option>
                <option value="High">High (Within 5 Mins)</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Description & Location Details</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the nature of the emergency clearly..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
            />
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-md flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Broadcast SOS</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
