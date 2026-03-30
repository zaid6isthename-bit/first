import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import Sidebar from './Sidebar';
import FocusView from './FocusView';

export default function Layout({ children }: { children: ReactNode }) {
  const { viewMode, setViewMode, tasks } = useStore();
  const isFocusMode = viewMode === 'focus';

  // If in Focus Mode, render entirely without the normal wrappers
  if (isFocusMode) {
    return (
      <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
        <FocusView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* TopNavBar (The Command Palette) */}
      <header className="fixed top-0 w-full z-50 bg-[#121315]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <span className="text-xl font-bold tracking-tighter bg-gradient-to-br from-violet-300 to-violet-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setViewMode('month')}>
            Aether OS
          </span>
          <div className="hidden md:flex flex-1 items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/5 group transition-all duration-300 hover:border-white/20">
            <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
            <input 
              className="bg-transparent border-none outline-none text-sm w-full font-label tracking-wide placeholder:text-slate-500 focus:ring-0" 
              placeholder="Jump to date, event, or task... (⌘K)" 
              type="text"
            />
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:bg-white/5 transition-all duration-300 rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="p-2 text-slate-400 hover:bg-white/5 transition-all duration-300 rounded-lg">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </nav>
      </header>

      {/* SideNavBar */}
      <Sidebar />

      {/* Main Canvas */}
      <main className="pt-20 lg:pl-[19rem] min-h-screen relative overflow-hidden">
        {/* Background Texture */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        
        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 p-4 md:p-8 w-full max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Jarvis-style AI Orb (Global) */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none group/orb">
        {/* Contextual Tooltip */}
        <div className="glass-panel px-4 py-3 rounded-2xl border-primary/20 mb-2 opacity-0 translate-y-4 transition-all duration-300 group-hover/orb:opacity-100 group-hover/orb:translate-y-0 text-left pointer-events-auto max-w-xs shadow-2xl">
          <p className="text-[10px] font-mono-technical text-primary mb-1 uppercase tracking-tighter">Aether Intelligence</p>
          <p className="text-xs text-slate-300 font-label italic">
            "You have {tasks.filter(t => !t.completed).length} pending tasks. Should I automatically schedule deep work to clear them?"
          </p>
        </div>
        
        <div className="relative cursor-pointer pointer-events-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container orb-glow flex items-center justify-center relative overflow-hidden transition-transform duration-500 hover:scale-110 shadow-lg" onClick={() => setViewMode('focus')}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent)] animate-pulse"></div>
            <span className="material-symbols-outlined text-on-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
          </div>
          {/* Ripple Rings */}
          <div className="absolute -inset-2 rounded-full border border-primary/20 animate-[ping_3s_linear_infinite]"></div>
          <div className="absolute -inset-4 rounded-full border border-primary/10 animate-[ping_4s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
