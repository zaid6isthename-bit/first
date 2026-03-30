import React from 'react';
import Sidebar from './Sidebar';
import TaskSidebar from './TaskSidebar';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, viewMode } = useStore();

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const isFocusMode = viewMode === 'focus';

  return (
    <div className={cn(
      "h-screen w-full flex overflow-hidden transition-colors duration-300",
      theme === 'dark' ? 'bg-background text-foreground' : 'bg-background text-foreground'
    )}>
      {!isFocusMode && <Sidebar />}
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header / Topbar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md z-10 transition-colors">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">{isFocusMode ? 'Focus Mode' : 'Calendar'}</h1>
          </div>
          {/* We can add search and user profile here */}
        </header>

        {/* Dynamic Main Content */}
        <motion.div 
          layout
          className="flex-1 overflow-auto p-6 relative"
        >
          {children}
        </motion.div>
      </main>

      {!isFocusMode && <TaskSidebar />}
    </div>
  );
}
