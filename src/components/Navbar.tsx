import React, {useState, useEffect} from 'react';
import {UserProfile, SosAlert} from '../types';
import {ShieldAlert, Bell, Sparkles, ChevronDown, CheckCircle2, Radio, Clock, LogIn, LogOut, Shield, AlertCircle} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  activeSosAlerts: SosAlert[];
  onOpenSosModal: () => void;
  onOpenAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSignInWithGoogle,
  onSignOut,
  activeSosAlerts,
  onOpenSosModal,
  onOpenAiModal,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const unacknowledgedSos = activeSosAlerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged');

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ExamSync Pro
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Real-Time Examination Management & Communication System</p>
          </div>
        </div>

        {/* Center: Live Clock & Active Exam Status */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Session Live</span>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center space-x-1.5 text-slate-700 text-sm font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:shadow-indigo-500/25 border border-indigo-500/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-100 animate-spin" style={{animationDuration: '4s'}} />
            <span className="hidden sm:inline">Controller AI</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:shadow-rose-500/30 border border-rose-500 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency SOS</span>
          </button>

          {/* Alerts Bell dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Active Alerts"
            >
              <Bell className="w-5 h-5" />
              {unacknowledgedSos.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unacknowledgedSos.length}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Incidents & SOS</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                    {unacknowledgedSos.length} Active
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {unacknowledgedSos.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-500">
                      No active emergency alerts. All clear!
                    </div>
                  ) : (
                    unacknowledgedSos.map(alert => (
                      <div key={alert.id} className="px-4 py-3 hover:bg-slate-50 transition">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-xs text-rose-600">{alert.alertType}</span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1">{alert.description}</p>
                        <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500">
                          <span>Venue: {alert.venue}</span>
                          <span className="text-indigo-600 font-medium">{alert.reportedBy}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Info / Profile Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-indigo-200"
                />
                <div className="hidden lg:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[10px] text-indigo-600 uppercase tracking-wide font-semibold">
                    {currentUser.role === 'admin' ? '🛡️ Exam Controller' : '📋 Faculty Invigilator'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {currentUser.role === 'admin' ? 'Super Admin / Controller' : 'Authorized Faculty'}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignInWithGoogle}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Google Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
