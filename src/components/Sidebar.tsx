import React from 'react';
import {LayoutDashboard, CalendarDays, Grid, Users, MessageSquare, ShieldAlert, BarChart3, Sparkles, UserCheck} from 'lucide-react';
import {UserProfile} from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  unreadChatCount: number;
  activeSosCount: number;
  facultyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadChatCount,
  activeSosCount,
  facultyCount,
}) => {
  const navItems = [
    {id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard},
    {id: 'exams', label: 'Exam Scheduling', icon: CalendarDays},
    {id: 'seating', label: 'Seating Arrangement', icon: Grid},
    {id: 'invigilation', label: 'Invigilation Duties', icon: UserCheck},
    {id: 'faculty', label: 'Faculty Registry', icon: Users, badge: facultyCount > 0 ? facultyCount : null},
    {id: 'chat', label: 'Live Chat & Comms', icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : null},
    {id: 'alerts', label: 'SOS & Incidents', icon: ShieldAlert, badge: activeSosCount > 0 ? activeSosCount : null, alertBadge: activeSosCount > 0},
    {id: 'reports', label: 'Reports & Analytics', icon: BarChart3},
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] shadow-sm">
      
      {/* Role Badge Banner */}
      <div className="p-4 border-b border-slate-200">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>CURRENT ACCESS</span>
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900 truncate">{currentUser.name}</div>
          <div className="mt-0.5 text-xs text-indigo-600 font-medium">
            {currentUser.role === 'admin' ? '🛡️ Exam Controller Admin' : '📋 Faculty Invigilator'}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== null && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.alertBadge
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Firestore Real-Time Sync</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Real Google Auth & Live Firestore database active.
          </p>
        </div>
      </div>

    </aside>
  );
};
