import React, {useState} from 'react';
import {StudentSeat} from '../types';
import {X, UserPlus} from 'lucide-react';

interface NewStudentSeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  venues: string[];
  onAddStudentSeat: (venue: string, seat: StudentSeat) => void;
}

export const NewStudentSeatModal: React.FC<NewStudentSeatModalProps> = ({
  isOpen,
  onClose,
  venues,
  onAddStudentSeat,
}) => {
  const [venue, setVenue] = useState(venues[0] || 'Room 101');
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [seatNumber, setSeatNumber] = useState('S-99');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNumber) return;

    const newSeat: StudentSeat = {
      seatNumber,
      row: 9,
      col: 9,
      studentId: `std-${Date.now()}`,
      studentName,
      rollNumber,
      branch,
      status: 'seated',
    };

    onAddStudentSeat(venue, newSeat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Add Candidate to Venue Seating</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Venue / Hall</label>
            <select
              value={venue}
              onChange={e => setVenue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {venues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                placeholder="e.g. CSE-2026-999"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Seat Number Designation</label>
            <input
              type="text"
              required
              placeholder="e.g. S-49"
              value={seatNumber}
              onChange={e => setSeatNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md"
            >
              Allocate Seat
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
