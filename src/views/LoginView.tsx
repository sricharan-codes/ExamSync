import React, {useState} from 'react';
import {Radio, Shield, Users, Calendar, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Lock} from 'lucide-react';

interface LoginViewProps {
  onSignInWithGoogle: () => Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = ({onSignInWithGoogle}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSignInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to authenticate with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-between font-sans text-slate-800">
      
      {/* Top Simple Bar */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ExamSync Pro
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Institutional Portal
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Institutional OAuth 2.0 Single Sign-On</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Left: Branding & Overview */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-8 sm:p-10 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Real-Time Examination Control</span>
              </div>
              
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Secure Examination Management & Live Comms
              </h1>
              
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Connect directly to university exam halls with dynamic seating charts, automated invigilator allocation, emergency SOS broadcasts, and incident reporting.
              </p>

              {/* Key Features List */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Anti-Cheating Randomized Seating Engine</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span>Real-Time Invigilation Duties & Check-In</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span>Multi-Hall Chat & Emergency SOS Dispatch</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
              Exam Controller Admins: <strong className="text-indigo-200">laxmisricharank@gmail.com</strong>, <strong className="text-indigo-200">babecanikissu7@gmail.com</strong>
            </div>
          </div>

          {/* Right: Sign-in Action */}
          <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500 mt-1">
                Please sign in with your authorized Google account to access your examination duties and console.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 space-y-4">
              {/* Google Sign In Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-sm hover:shadow transition flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
              >
                {/* Official Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Role-based access enforced by institutional policy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Non-admin faculty members must be pre-registered by an Exam Controller (<span className="text-slate-600 font-medium">laxmisricharank@gmail.com</span> or <span className="text-slate-600 font-medium">babecanikissu7@gmail.com</span>) before being assigned active exam duties.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        &copy; 2026 ExamSync Pro • Real-Time Examination Management and Communication System
      </footer>

    </div>
  );
};
