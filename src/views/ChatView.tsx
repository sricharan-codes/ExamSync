import React, {useState} from 'react';
import {ChatMessage, ChatChannel, UserProfile} from '../types';
import {MessageSquare, Send, Hash, Radio, Shield, Users, Paperclip, Plus} from 'lucide-react';

interface ChatViewProps {
  channels: ChatChannel[];
  messages: ChatMessage[];
  onSendMessage: (channelId: string, content: string) => void;
  currentUser: UserProfile;
  onOpenNewChannelModal: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  channels,
  messages,
  onSendMessage,
  currentUser,
  onOpenNewChannelModal,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>('broadcast');
  const [inputText, setInputText] = useState<string>('');

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === activeChannelId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeChannelId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-8.5rem)] animate-in fade-in duration-300">
      
      {/* Sidebar: Channels */}
      <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Exam Comms</span>
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time sync</p>
          </div>
          <button
            onClick={onOpenNewChannelModal}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 transition cursor-pointer shadow-sm"
            title="Create Custom Channel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {channels.map(channel => {
            const isActive = channel.id === activeChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold truncate">{channel.name}</span>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-100/50">
          <div className="flex items-center space-x-2 text-[10px] text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WebSocket Connected (Secure)</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-3 flex flex-col bg-white">
        
        {/* Channel Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{activeChannel.name}</h3>
            <p className="text-[10px] text-slate-500">{activeChannel.description}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
            Secure Exam Room
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {channelMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200 shrink-0 mt-1"
                />
                <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        msg.senderRole === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {msg.senderRole === 'admin' ? 'Controller' : 'Staff'}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center space-x-3 shrink-0">
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            title="Attach file / report snapshot"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder={`Message ${activeChannel.name}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
};
