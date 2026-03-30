import { useStore } from '../store/useStore';
import { isToday, parseISO } from 'date-fns';

export default function FocusView() {
  const { tasks, events, toggleTaskCompletion, setViewMode } = useStore();
  
  const todayTasks = tasks.filter(t => !t.deadline || isToday(new Date(t.deadline)));
  const todayEvents = events.filter(e => isToday(parseISO(e.startTime)));
  
  const activeTask = todayTasks.find(t => !t.completed) || { title: 'No active tasks', id: undefined };
  const nextEvent = todayEvents.length > 0 ? todayEvents[0] : null;

  return (
    <div className="relative min-h-full flex items-center justify-center p-4 md:p-6 bg-mesh overflow-hidden w-full h-full rounded-2xl">
      {/* Ambient Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-inverse-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* The AI Orb (Floating Guide) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 group cursor-help">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-primary-container orb-animation flex items-center justify-center magnetic-physics group-hover:scale-110 shadow-[0_0_20px_rgba(208,188,255,0.4)]">
            <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 magnetic-physics bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/30 px-4 py-2 rounded-full mb-2">
            <span className="text-[10px] font-mono-technical uppercase tracking-widest text-primary">Aether Intelligence: Active</span>
          </div>
        </div>
      </div>

      {/* Focus Canvas */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mt-12 md:mt-0">
        
        {/* Morphing Timer / Task Card */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] flex items-center justify-center bg-surface-container-low/30 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center gap-6 p-8 w-full z-10">
            {/* HUD Metadata */}
            <div className="flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[11px] font-mono-technical tracking-[0.2em] uppercase">Session: Deep Work</span>
              </div>
              <div className="w-px h-3 bg-outline-variant"></div>
              <span className="text-[11px] font-mono-technical tracking-[0.2em] uppercase">Tasks: {todayTasks.filter(t => !t.completed).length} Left</span>
            </div>

            {/* The Central Focal Point */}
            <div className="flex flex-col items-center text-center mt-2">
              <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter text-on-surface mb-4 font-headline leading-none">
                 Focus
              </h1>
              <h2 className="text-xl md:text-2xl font-light text-primary/80 tracking-tight font-headline max-w-2xl px-4 truncate">
                {activeTask.title}
              </h2>
            </div>

            {/* Hidden Controls (Hover Reveal) */}
            <div className="flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 magnetic-physics transform translate-y-4 group-hover:translate-y-0 mt-4">
              <button 
                onClick={() => setViewMode('month')}
                className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all group/btn"
                title="Return to Calendar"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover/btn:text-primary">calendar_month</span>
              </button>
              <button 
                onClick={() => activeTask.id ? toggleTaskCompletion(activeTask.id) : null}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary-container text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(208,188,255,0.4)] hover:shadow-[0_0_25px_rgba(208,188,255,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                Complete Task
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all group/btn">
                <span className="material-symbols-outlined text-on-surface-variant group-hover/btn:text-primary">forward_10</span>
              </button>
            </div>
          </div>
          
          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
            <div className="h-full bg-primary w-2/3 shadow-[0_0_15px_rgba(208,188,255,0.6)]"></div>
          </div>
        </div>

        {/* Task Detail Expansion (Floating below) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity duration-500">
          <div className="p-5 rounded-2xl bg-surface-container-highest/40 border border-white/5 backdrop-blur-md flex flex-col gap-3 transition-colors hover:bg-surface-container-highest/60">
            <span className="text-[10px] font-mono-technical uppercase tracking-widest text-outline">Up Next</span>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              {nextEvent ? `${nextEvent.title} at ${new Date(nextEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No upcoming events today. Your schedule is clear.'}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-highest/40 border border-white/5 backdrop-blur-md flex flex-col gap-3 transition-colors hover:bg-surface-container-highest/60 col-span-1 md:col-span-2">
            <span className="text-[10px] font-mono-technical uppercase tracking-widest text-outline">Today's Queue</span>
            <div className="flex flex-col gap-2 max-h-24 overflow-y-auto pr-2 no-scrollbar">
              {todayTasks.filter(t => !t.completed).map(t => (
                <div key={t.id} className="flex items-center justify-between gap-3 group/task">
                  <div className="flex items-center gap-3 truncate">
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover/task:text-primary cursor-pointer transition-colors" onClick={() => toggleTaskCompletion(t.id)}>radio_button_unchecked</span>
                    <span className="text-xs text-on-surface-variant font-medium truncate">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono-technical text-outline/50">{t.priority}</span>
                </div>
              ))}
              {todayTasks.filter(t => !t.completed).length === 0 && (
                <span className="text-xs text-primary/60 italic">All tasks completed. Excellent work.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* System Exit */}
      <div className="absolute top-4 right-4 md:bottom-8 md:top-auto md:right-8 z-50">
        <button onClick={() => setViewMode('month')} className="flex items-center gap-3 px-4 py-2 rounded-lg border border-outline-variant/20 hover:bg-error/10 hover:border-error/30 transition-all text-outline hover:text-error group">
          <span className="text-[10px] font-mono-technical uppercase tracking-widest">Terminate Focus</span>
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,19,21,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
}
