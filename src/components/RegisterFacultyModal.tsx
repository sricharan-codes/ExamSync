import React, {useState} from 'react';
import {FacultyMember, UserRole} from '../types';
import {X, UserPlus, Shield, Mail, Building, Briefcase, Hash, Phone} from 'lucide-react';

interface RegisterFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterFaculty: (faculty: Omit<FacultyMember, 'id' | 'registeredAt'>) => Promise<void>;
  currentUserEmail: string;
}

export const RegisterFacultyModal: React.FC<RegisterFacultyModalProps> = ({
  isOpen,
  onClose,
  onRegisterFaculty,
  currentUserEmail,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor & Invigilator');
  const [role, setRole] = useState<UserRole>('staff');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide candidate name and email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onRegisterFaculty({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department,
        designation,
        role,
        employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: phone.trim() || undefined,
        registeredBy: currentUserEmail,
        status: 'active',
      });

      setName('');
      setEmail('');
      setEmployeeId('');
      setPhone('');
      onClose();
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to register faculty member in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Register Faculty Member</h3>
              <p className="text-[10px] text-slate-500">Only authorized Exam Controllers can register institutional faculty</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Jane Foster"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                placeholder="faculty@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Eng</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="staff">Staff / Faculty Invigilator</option>
                <option value="admin">Exam Controller (Admin)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                placeholder="e.g. Associate Professor"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. EMP-4091"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Registrar: <strong className="text-slate-800">{currentUserEmail}</strong>
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{loading ? 'Registering...' : 'Register Faculty'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
