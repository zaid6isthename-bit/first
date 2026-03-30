import { useStore } from '../store/useStore';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function CalendarView() {
  const { events, currentDate } = useStore();
  const [activeTab, setActiveTab] = useState('Month');
  
  const currentMonthStart = startOfMonth(new Date(currentDate));
  const currentMonthEnd = endOfMonth(new Date(currentDate));
  const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

  // Mock function to determine random Y positioning for beautiful timeline scatter
  const getEventYPosition = (index: number) => {
    const positions = [40, 150, 240, 320, 80, 190];
    return positions[index % positions.length];
  }

  return (
    <div className="w-full flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative min-h-screen pb-20">
      
      {/* Timeline Header Controls */}
      <div className="relative z-10 px-4 md:px-8 py-6 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8 md:mt-2">
        <div>
          <h1 className="text-4xl font-extralight tracking-tight text-white mb-2 font-headline">
            {format(new Date(currentDate), 'MMMM')} <span className="text-primary/60">{format(new Date(currentDate), 'yyyy')}</span>
          </h1>
          <div className="flex gap-4">
            <span className="text-[10px] font-mono-technical uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Live Sync Active</span>
            <span className="text-[10px] font-mono-technical uppercase tracking-[0.2em] text-slate-500 flex items-center">{events.length} Scheduled Events</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {['Year', 'Month', 'Week', 'Day'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-[10px] font-mono-technical uppercase tracking-widest transition-colors rounded-lg",
                activeTab === tab 
                  ? "text-white bg-white/10 shadow-sm" 
                  : "text-slate-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* The Infinite Scroll Timeline */}
      <div className="relative w-full h-[500px] mt-4 overflow-x-auto overflow-y-hidden no-scrollbar cursor-crosshair group flex">
        
        {/* Heatmap Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 blur-3xl overflow-hidden pointer-events-none sticky left-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[200px] bg-primary rounded-full mix-blend-screen animate-[pulse_8s_infinite]"></div>
          <div className="absolute top-1/2 left-[60%] w-[300px] h-[150px] bg-secondary rounded-full mix-blend-screen opacity-20 animate-[pulse_6s_infinite]"></div>
        </div>

        {/* Time Markers & Grid Container */}
        <div className="relative h-full flex pt-8 pb-4 min-w-max">
          {daysInMonth.map((day) => {
            const isCurr = isToday(day);
            const dayEvents = events.filter(e => isToday(parseISO(e.startTime)));
            
            return (
              <div key={day.toISOString()} className="relative flex-shrink-0 w-64 md:w-80 h-full border-l border-white/5 last:border-r transition-colors group/col hover:bg-white/[0.02]">
                {/* Column Background Highlight for Today */}
                {isCurr && (
                  <>
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/50 shadow-[0_0_15px_rgba(208,188,255,0.4)] z-0 block"></div>
                    <div className="absolute inset-0 bg-primary/5 z-0"></div>
                  </>
                )}
                
                {/* Day Header */}
                <span className={cn(
                  "absolute top-0 left-4 font-mono-technical text-[10px] uppercase font-bold tracking-widest z-20",
                  isCurr ? "text-primary shadow-sm" : "text-slate-600 group-hover/col:text-slate-400"
                )}>
                  {isCurr ? 'Today' : format(day, 'EEE dd')}
                </span>

                {/* Event Cards for this Day */}
                <div className="relative w-full h-full mt-8">
                  {dayEvents.map((evt, eIdx) => (
                    <div 
                      key={evt.id} 
                      className="absolute left-6 right-6 glass-panel rounded-2xl p-4 md:p-5 group/card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-30 overflow-hidden cursor-pointer"
                      style={{ top: `${getEventYPosition(eIdx)}px` }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60" style={{ backgroundColor: evt.color }}></div>
                      <div className="flex justify-between items-start mb-3">
                        <span 
                          className="px-2 py-0.5 rounded text-[8px] font-mono-technical uppercase tracking-widest border"
                          style={{ color: evt.color, borderColor: `${evt.color}40`, backgroundColor: `${evt.color}15` }}
                        >
                          {evt.tags?.[0] || 'Scheduled'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono-technical">
                          {format(parseISO(evt.startTime), 'HH:mm')}
                        </span>
                      </div>
                      <h4 className="text-white text-base md:text-lg font-light leading-snug truncate">{evt.title}</h4>
                      {evt.description && (
                         <p className="text-[10px] text-slate-500 font-label tracking-wide mt-2 line-clamp-2">{evt.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {/* Empty state visual filler if no events */}
                  {dayEvents.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity">
                       <span className="text-[10px] font-mono-technical uppercase text-slate-700 w-full text-center tracking-[0.3em]">Clear</span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats / Bento Footer Section */}
      <div className="px-4 md:px-8 mt-12 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl col-span-1 md:col-span-2">
            <h5 className="text-[10px] font-mono-technical uppercase tracking-[0.2em] text-slate-500 mb-4">Focus Distribution</h5>
            <div className="flex items-end gap-2 h-32 opacity-80">
              <div className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" style={{height: "60%"}}></div>
              <div className="flex-1 bg-primary/40 rounded-t-lg transition-all hover:bg-primary/60" style={{height: "85%"}}></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" style={{height: "40%"}}></div>
              <div className="flex-1 bg-primary/60 rounded-t-lg transition-all hover:bg-primary/80" style={{height: "95%"}}></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" style={{height: "55%"}}></div>
              <div className="flex-1 bg-secondary/30 rounded-t-lg transition-all hover:bg-secondary/50" style={{height: "30%"}}></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" style={{height: "45%"}}></div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center">
            <h5 className="text-[10px] font-mono-technical uppercase tracking-[0.2em] text-slate-500 mb-4 w-full text-left">Time Gained</h5>
            <div className="flex flex-col items-center justify-center h-full pb-4">
              <span className="text-4xl md:text-5xl font-extralight text-primary">+12.4h</span>
              <span className="text-[9px] font-mono-technical text-slate-400 mt-2 uppercase tracking-widest">v.s last week</span>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
            <h5 className="text-[10px] font-mono-technical uppercase tracking-[0.2em] text-slate-500 mb-4 w-full text-left">System Load</h5>
            <div className="relative w-24 h-24 mx-auto mt-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2"></path>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient)" strokeDasharray="75, 100" strokeWidth="2"></path>
                <defs>
                  <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" style={{stopColor: "#d0bcff"}}></stop>
                    <stop offset="100%" style={{stopColor: "#a078ff"}}></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono-technical text-white">75%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
