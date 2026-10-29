import React, {useState} from 'react';
import {X, Sparkles, Send, Bot, User as UserIcon, Loader2} from 'lucide-react';
import {Exam, SosAlert} from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: Exam[];
  sosAlerts: SosAlert[];
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  exams,
  sosAlerts,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello, Controller! I am your ExamSync Pro AI Assistant. I can analyze seating conflict risks, draft broadcast notices, suggest invigilator reallocations, or summarize exam operations. How can I assist you today?",
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setMessages(prev => [...prev, {sender: 'user', text: userMsg}]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: userMsg,
          context: {
            activeExams: exams.filter(e => e.status === 'Ongoing'),
            totalExams: exams.length,
            activeSosAlerts: sosAlerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged'),
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, {sender: 'ai', text: `Error: ${data.error}`}]);
      } else {
        setMessages(prev => [...prev, {sender: 'ai', text: data.response}]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {sender: 'ai', text: `Failed to connect to AI server: ${err.message || 'Unknown error'}`}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl h-[600px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ExamSync Pro AI Assistant</h3>
              <p className="text-[10px] text-indigo-600 font-medium">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'ai' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'ai'
                    ? 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center space-x-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI is analyzing exam data and drafting response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center space-x-3 shrink-0">
          <input
            type="text"
            placeholder="Ask AI about seating conflicts, invigilation fairness, or broadcast drafts..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
