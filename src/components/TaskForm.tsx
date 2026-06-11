import React, { useState } from 'react';
import { Priority } from '../types';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (title: string, description: string, priority: Priority) => void;
}

export function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onAdd(title.trim(), description.trim(), priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={isShaking ? 'animate-shake' : ''}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name..."
            className="w-full px-4 py-3 bg-[#F3F3EF] dark:bg-[#1E1E1E] border-2 border-transparent focus:border-[#1E3A8A] dark:focus:border-[#2563EB] rounded-[16px] outline-none text-sm transition-colors text-[#2D2D2D] dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#2D2D2D]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short details... (optional)"
          rows={3}
          className="w-full px-4 py-3 bg-[#F3F3EF] dark:bg-[#1E1E1E] border-2 border-transparent focus:border-[#1E3A8A] dark:focus:border-[#2563EB] rounded-[16px] outline-none text-sm transition-colors text-[#2D2D2D] dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#2D2D2D] resize-none h-24"
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Priority</span>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                priority === p
                ? 'border-2 border-[#1E3A8A] bg-[#1E3A8A]/5 dark:border-[#2563EB] dark:bg-[#2563EB]/20 text-[#1E3A8A] dark:text-[#E2E2D5]'
                : 'border border-gray-200 dark:border-gray-700 bg-transparent text-gray-500 dark:text-gray-400 hover:border-[#1E3A8A] dark:hover:border-[#2563EB]'
              } capitalize`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white rounded-[16px] font-medium text-sm transition-colors"
      >
        Create Task
      </button>
    </form>
  );
}
