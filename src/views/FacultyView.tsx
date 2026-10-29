import React, {useState} from 'react';
import {FacultyMember, UserProfile} from '../types';
import {Users, UserPlus, Shield, Search, Mail, Building, Trash2, CheckCircle2, UserCheck, AlertCircle} from 'lucide-react';

interface FacultyViewProps {
  facultyList: FacultyMember[];
  currentUser: UserProfile;
  onOpenRegisterModal: () => void;
  onDeleteFaculty?: (id: string) => Promise<void>;
}

export const FacultyView: React.FC<FacultyViewProps> = ({
  facultyList,
  currentUser,
  onOpenRegisterModal,
  onDeleteFaculty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'admin' | 'staff'>('All');

  const filteredFaculty = facultyList.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || f.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900">Faculty & Staff Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              {facultyList.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional directory of authorized faculty invigilators and exam controllers.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={onOpenRegisterModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Faculty</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Only Admins can register faculty</span>
          </div>
        )}
      </div>

      {/* Admin Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-2xl border border-indigo-100 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Strict Institutional Access Control</p>
          <p className="text-slate-600 mt-0.5">
            Super Admins: <strong className="text-indigo-700">laxmisricharank@gmail.com</strong>, <strong className="text-indigo-700">babecanikissu7@gmail.com</strong>.
            When faculty sign in with Google, their account must be pre-registered by an Admin to access examination invigilation functions.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          {(['All', 'admin', 'staff'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer capitalize ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {role === 'All' ? 'All Roles' : role === 'admin' ? 'Admins' : 'Faculty'}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Faculty Name & Email</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Designation</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Registered By</th>
                <th className="px-6 py-3.5">Status</th>
                {isAdmin && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredFaculty.map(faculty => (
                <tr key={faculty.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {faculty.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{faculty.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{faculty.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{faculty.department}</div>
                    {faculty.employeeId && (
                      <div className="text-[10px] text-slate-400 font-mono">{faculty.employeeId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {faculty.designation}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        faculty.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {faculty.role === 'admin' ? '🛡️ Exam Controller' : '📋 Faculty Invigilator'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-[11px]">
                    {faculty.registeredBy || 'System Bootstrap'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active</span>
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {faculty.email !== 'laxmisricharank@gmail.com' && onDeleteFaculty && (
                        <button
                          onClick={() => onDeleteFaculty(faculty.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Remove Faculty Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filteredFaculty.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-slate-500">
                    No faculty members found matching your search.
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
