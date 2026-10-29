import React, {useState} from 'react';
import {ChatChannel} from '../types';
import {X, MessageSquare} from 'lucide-react';

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: ChatChannel) => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChannel: ChatChannel = {
      id: `channel-${Date.now()}`,
      name: `💬 ${name.trim()}`,
      type: 'room',
      description: description.trim() || 'Custom coordination channel',
    };

    onAddChannel(newChannel);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Create Custom Chat Channel</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Hall-B-Invigilators"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Purpose</label>
            <textarea
              rows={3}
              placeholder="Describe the purpose of this channel..."
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              Create Channel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
