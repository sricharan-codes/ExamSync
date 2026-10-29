import React, {useState} from 'react';
import {IncidentReport, Exam, UserProfile} from '../types';
import {X, FileText} from 'lucide-react';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncident: (incident: IncidentReport) => void;
  exams: Exam[];
  currentUser: UserProfile;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onAddIncident,
  exams,
  currentUser,
}) => {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [studentName, setStudentName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [category, setCategory] = useState<IncidentReport['category']>('Malpractice');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exam = exams.find(ex => ex.id === selectedExamId);
    if (!exam || !studentName.trim()) return;

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      examId: exam.id,
      courseCode: exam.courseCode,
      venue: exam.venue,
      studentRollNumber: studentRollNumber.trim() || 'CSE-2026-000',
      studentName: studentName.trim(),
      reportedBy: currentUser.name,
      category,
      details,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      status: 'Pending Review',
    };

    onAddIncident(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Log Custom Incident / Malpractice</h3>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                placeholder="e.g. CSE-2026-105"
                value={studentRollNumber}
                onChange={e => setStudentRollNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option value="Malpractice">Malpractice</option>
              <option value="Late Arrival">Late Arrival</option>
              <option value="Medical">Medical Emergency</option>
              <option value="Dispute">Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the exact incident details..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
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
              Submit Report
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
