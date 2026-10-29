import React from 'react';
import {UserProfile} from '../types';
import {ShieldAlert, LogOut, RefreshCw, Mail, CheckCircle2, UserX} from 'lucide-react';

interface UnauthorizedViewProps {
  currentUser: UserProfile;
  onSignOut: () => void;
  onRefresh: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  currentUser,
  onSignOut,
  onRefresh,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center animate-in fade-in zoom-in duration-200">
        
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-inner mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Authorization Pending
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Your institutional account has not yet been registered in the Faculty Directory.
        </p>

        {/* User Card */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-left">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
            <span className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Unregistered Faculty
            </span>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-900 space-y-2">
          <p className="font-semibold text-amber-950 flex items-center space-x-1.5">
            <span>Notice from Exam Control Board:</span>
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            By institutional security policy, only Exam Controllers can register faculty and invigilators. Please contact an administrator below to register your email (<strong className="text-slate-900">{currentUser.email}</strong>):
          </p>
          <div className="pt-1 text-[11px] font-mono font-semibold text-indigo-700 space-y-0.5">
            <div>laxmisricharank@gmail.com</div>
            <div>babecanikissu7@gmail.com</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={onRefresh}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Registration Status</span>
          </button>
          <button
            onClick={onSignOut}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch Google Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
