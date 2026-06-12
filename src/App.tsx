import { useMemo, useEffect } from 'react';
import { Moon, Sun, Sparkles, CheckCircle2, LogIn, LogOut } from 'lucide-react';
import { Task, Priority, Status } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFirebaseTasks } from './hooks/useFirebaseTasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { AnimatePresence, motion } from 'motion/react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut } from 'firebase/auth';

export default function App() {
  const { tasks, user, loading, addTask, updateTaskStatus, deleteTask } = useFirebaseTasks();
  const [isDark, setIsDark] = useLocalStorage<boolean>('cozy-taskflow-theme', false);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error('Redirect result error:', error);
      alert(`Login failed after redirect: ${error.message}\nThis might be due to third-party cookies being blocked in your browser.`);
    });
  }, []);

  const activeTasks = useMemo(() => tasks.filter(t => t.status === 'active').sort((a, b) => b.createdAt - a.createdAt), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed').sort((a, b) => b.createdAt - a.createdAt), [tasks]);

  const handleToggleTheme = () => setIsDark(!isDark);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Login was cancelled. Please make sure not to close the popup window while signing in.');
      } else {
        alert(`Login failed: ${error.message}\nMake sure chetnya6767.github.io is added to Authorized domains in Firebase Console.`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.backgroundColor = '#1E1E1E';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F9F7F2';
    }
  }, [isDark]);

  const panelStyle = "flex flex-col h-full";
  const panelHeaderStyle = "font-semibold text-gray-500 flex items-center justify-between mb-4 px-2 tracking-wide";

  return (
    <div className={`relative min-h-screen transition-colors duration-500 font-sans dot-grid ${isDark ? 'dark bg-[#1E1E1E] text-slate-100' : 'bg-[#F9F7F2] text-[#2D2D2D]'}`}>
      
      <AnimatePresence>
        {!user && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-[#F9F7F2]/80 dark:bg-[#1E1E1E]/80 backdrop-blur-[6px]" 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1E3A8A] dark:bg-[#2563EB] rounded-[18px] flex items-center justify-center text-white font-bold text-2xl shadow-inner font-['Quicksand'] transform -rotate-6 pt-0.5">
            T
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#2D2D2D] dark:text-white">Taskflow</h1>
        </div>
        <div className="flex items-center gap-4 bg-white/80 dark:bg-[#2D2D2D]/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
          {user ? (
            <div className="flex items-center gap-3 pl-3 pr-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Signed in as <span className="font-bold text-[#2D2D2D] dark:text-white">{user.displayName || user.email}</span>
              </span>
              <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] transition-colors"
                  aria-label="Logout"
                  title="Logout"
              >
                  <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                  onClick={handleLogin}
                  className="px-4 py-2.5 text-sm font-bold rounded-xl bg-[#1E3A8A] dark:bg-[#2563EB] text-white hover:bg-[#1E40AF] dark:hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_20px_rgba(30,58,138,0.2)] dark:shadow-[0_8px_20px_rgba(37,99,235,0.2)] ring-4 ring-[#1E3A8A]/10 dark:ring-[#2563EB]/10 relative z-50"
              >
                  <span className="flex items-center gap-2"><LogIn className="w-4 h-4"/> Sign In</span>
              </button>
              
              {!loading && (
                <div className="absolute top-[120%] right-0 sm:right-6 w-[280px] sm:w-[320px] pointer-events-none flex flex-col items-end text-[#1E3A8A] dark:text-[#60A5FA]">
                  <svg className="w-20 h-24 stroke-current stroke-[3] fill-none mr-8" style={{ strokeDasharray: "5 7" }} viewBox="0 0 100 100" preserveAspectRatio="none">
                     <defs>
                       <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                         <path d="M 2 2 L 8 5 L 2 8" className="stroke-current stroke-[3] fill-none" strokeLinecap="round" strokeLinejoin="round" />
                       </marker>
                     </defs>
                     <path d="M 40 90 C 130 60, -20 30, 85 15" markerEnd="url(#arrow)" strokeLinecap="round" />
                  </svg>
                  <div className="bg-white/95 dark:bg-[#2D2D2D]/95 px-6 py-5 rounded-[24px] shadow-2xl border-[3px] border-[#1E3A8A]/10 dark:border-white/10 text-center transform -rotate-2 mt-2 mr-[-10px] sm:mr-[-5px] relative z-50 backdrop-blur-md pointer-events-auto">
                    <p className="font-bold text-lg mb-1 tracking-tight text-[#2D2D2D] dark:text-white">Sync Everywhere 🚀</p>
                    <p className="text-sm opacity-80 leading-relaxed font-medium text-gray-600 dark:text-gray-300">Sign in to securely save and access your tasks on <span className="font-bold text-[#1E3A8A] dark:text-[#60A5FA]">any device</span> using your Google account.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-[#1E3A8A] dark:bg-[#2563EB] text-white shadow-inner hover:bg-[#1E40AF] dark:hover:bg-[#1D4ED8] transition-colors"
              aria-label="Toggle Theme"
          >
              {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">

        {/* Panel 1: Add Task */}
        <section className={panelStyle}>
            <div className={`bg-white dark:bg-[#2D2D2D] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-white/5 p-6 flex flex-col gap-4 ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-medium mb-2 text-[#2D2D2D] dark:text-white">Add New Task</h2>
              <TaskForm onAdd={addTask} />
            </div>
            {!user && (
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Sign in to add tasks and sync them device-to-device.
              </div>
            )}
        </section>

        {/* Panel 2: Active Tasks */}
        <section className={panelStyle}>
            <h2 className={panelHeaderStyle}>
              Active Tasks
              <span className="bg-white dark:bg-[#2D2D2D] px-2 py-0.5 rounded-lg text-xs border border-black/5 dark:border-white/5 shadow-sm text-gray-600 dark:text-gray-300">
                {activeTasks.length}
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-8 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px]"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-[#2D2D2D] rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <Sparkles className="w-6 h-6 text-[#1E3A8A] dark:text-[#2563EB] opacity-50" />
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">All caught up!<br/>Time to relax.</p>
                  </motion.div>
                ) : (
                  activeTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={updateTaskStatus}
                      onDelete={deleteTask}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
        </section>

        {/* Panel 3: Completed Tasks */}
        <section className={panelStyle}>
            <h2 className={panelHeaderStyle}>
              Completed
              <span className="bg-white dark:bg-[#2D2D2D] px-2 py-0.5 rounded-lg text-xs border border-black/5 dark:border-white/5 shadow-sm text-gray-600 dark:text-gray-300">
                {completedTasks.length}
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {completedTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-8 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px]"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-[#2D2D2D] rounded-full flex items-center justify-center mb-4 shadow-sm border border-black/5 dark:border-white/5">
                      <CheckCircle2 className="w-6 h-6 text-[#1E3A8A] dark:text-[#2563EB] opacity-50"/>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Almost there!<br/>Finish your active tasks to clear the board.</p>
                  </motion.div>
                ) : (
                  completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={updateTaskStatus}
                      onDelete={deleteTask}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
        </section>

      </main>
    </div>
  );
}
