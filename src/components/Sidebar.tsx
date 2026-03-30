import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import type { ViewMode } from '../types';

export default function Sidebar() {
  const { viewMode, setViewMode } = useStore();

  const navItems: { id: ViewMode; label: string; icon: string; subtitle?: string }[] = [
    { id: 'month', label: 'Workspace', icon: 'grid_view' },
    { id: 'week', label: 'Network', icon: 'hub' },
    { id: 'day', label: 'Nodes', icon: 'account_tree' },
  ];

  return (
    <aside className="fixed left-4 top-20 bottom-4 w-64 rounded-2xl bg-[#121315]/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col h-auto py-6 z-40 hidden lg:flex">
      {/* Profile Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary font-bold text-xs shadow-lg">
             JD
          </div>
          <div>
            <h3 className="font-mono-technical text-[11px] uppercase tracking-widest text-white leading-none mt-1">
              Core Terminal
            </h3>
            <p className="text-[9px] text-slate-500 font-label tracking-tighter uppercase mt-1">
              AI Productivity
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 gap-1">
        {navItems.map(item => {
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-violet-500/10 text-violet-300 border-r-2 border-violet-500 shadow-[inset_2px_0_10px_rgba(139,92,246,0.1)]" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span className="font-mono-technical text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          )
        })}

        <button
          onClick={() => setViewMode('focus')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:text-primary transition-colors">psychology</span>
          <span className="font-mono-technical text-[11px] uppercase tracking-widest group-hover:text-primary transition-colors">Intelligence</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300">
          <span className="material-symbols-outlined text-lg">inventory_2</span>
          <span className="font-mono-technical text-[11px] uppercase tracking-widest">Archive</span>
        </button>
      </nav>

      {/* Footer Actions */}
      <div className="px-4 mt-auto space-y-4">
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary-container/20 border border-primary/30 text-primary text-[10px] font-mono-technical uppercase tracking-[0.2em] hover:bg-primary/30 hover:shadow-[0_0_15px_rgba(208,188,255,0.2)] transition-all">
          New Logic
        </button>
        
        <div className="flex flex-col gap-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-mono-technical text-[10px] uppercase tracking-widest">Help</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-error transition-all hover:bg-error/10 rounded-lg">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-mono-technical text-[10px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
