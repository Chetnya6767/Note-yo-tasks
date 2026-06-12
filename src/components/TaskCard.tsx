import { motion } from 'motion/react';
import { Task, Status } from '../types';
import { Check, RotateCcw, Trash2 } from 'lucide-react';

interface Props {
  key?: string;
  task: Task;
  onStatusChange: (id: string, newStatus: Status) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const isCompleted = task.status === 'completed';

  const priorityStyles = {
    low: { tag: 'bg-[#E5F9F1] text-[#27AE60] dark:bg-[#27AE60]/20 dark:text-[#E5F9F1]', border: 'border-l-[#27AE60]' },
    medium: { tag: 'bg-[#FFF4E5] text-[#E67E22] dark:bg-[#E67E22]/20 dark:text-[#FFF4E5]', border: 'border-l-[#E67E22]' },
    high: { tag: 'bg-[#FFE5E5] text-[#D63031] dark:bg-[#D63031]/20 dark:text-[#FFE5E5]', border: 'border-l-[#D63031]' }
  };

  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        className={`group relative flex flex-col p-5 rounded-[24px] transition-all duration-200
          ${isCompleted 
            ? 'opacity-60 bg-gray-50/50 dark:bg-black/20 border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-none' 
            : `bg-white dark:bg-[#2D2D2D] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-white/5 border-l-4 ${priorityStyles[task.priority].border} hover:-translate-y-1`}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isCompleted ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400' : priorityStyles[task.priority].tag}`}>
          {isCompleted ? 'Completed' : `${task.priority} Priority`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={`font-semibold text-lg mb-1 leading-tight text-[#2D2D2D] dark:text-white ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
        {task.title}
      </h3>

      {task.description && (
        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-4 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : ''}`}>
          {task.description}
        </p>
      )}

      <div className="mt-auto pt-2">
          {isCompleted ? (
            <button
              onClick={() => onStatusChange(task.id, 'active')}
              className="w-full py-2 bg-[#F3F3EF] hover:bg-[#E2E2D5] dark:bg-[#1E1E1E] dark:hover:bg-[#3A3A3A] text-[#2D2D2D] dark:text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Undo
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              className="w-full py-2 bg-[#F3F3EF] hover:bg-[#E2E2D5] dark:bg-[#1E1E1E] dark:hover:bg-[#3A3A3A] text-[#2D2D2D] dark:text-white rounded-xl text-sm font-medium transition-colors"
            >
              Mark as Complete
            </button>
          )}
      </div>
    </motion.div>
  );
}
