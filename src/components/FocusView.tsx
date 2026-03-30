import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { isToday, parseISO } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FocusView() {
  const { tasks, events, toggleTaskCompletion } = useStore();

  const todayTasks = tasks.filter(t => !t.deadline || isToday(new Date(t.deadline)));
  const todayEvents = events.filter(e => isToday(parseISO(e.startTime)));

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-background via-muted/30 to-background p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent mb-4">Focus Zone</h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">Disconnect from the noise. Here is what matters today.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl shadow-accent/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -z-10 rounded-full" />
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
              Critical Tasks
              <span className="text-sm font-semibold bg-accent/20 text-accent px-3 py-1 rounded-full">{todayTasks.filter(t => !t.completed).length} Left</span>
            </h2>
            <div className="space-y-4">
              {todayTasks.length === 0 && (
                <p className="text-muted-foreground text-center py-6">No tasks for today. You are free!</p>
              )}
              {todayTasks.map(t => (
                <div key={t.id} onClick={() => toggleTaskCompletion(t.id)} className="flex items-center gap-4 cursor-pointer group">
                  <div className={cn("transition-colors", t.completed ? "text-accent" : "text-muted-foreground group-hover:text-foreground")}>
                    {t.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <span className={cn("text-lg font-medium transition-all", t.completed ? "line-through text-muted-foreground opacity-50" : "text-foreground")}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl shadow-blue-500/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
              Today's Schedule
              <span className="text-sm font-semibold bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full">{todayEvents.length} Events</span>
            </h2>
            <div className="space-y-4 relative">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border rounded-full" />
              {todayEvents.length === 0 && (
                <p className="text-muted-foreground text-center py-6">No events scheduled. Time is yours.</p>
              )}
              {todayEvents.map(e => (
                <div key={e.id} className="pl-8 relative">
                  <div className="absolute left-1 top-2.5 w-2.5 h-2.5 rounded-full ring-4 ring-background" style={{ backgroundColor: e.color }} />
                  <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/40 hover:border-border transition-colors group cursor-default">
                    <h3 className="font-semibold text-[15px] group-hover:text-accent transition-colors">{e.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(e.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold tracking-widest text-white uppercase overflow-hidden rounded-full bg-foreground shadow-lg shadow-black/20 hover:shadow-black/40 transition-shadow dark:bg-white dark:text-black"
          >
            <span className="absolute inset-0 bg-accent transition-transform duration-300 ease-out transform -translate-x-full group-hover:translate-x-0" />
            <span className="relative flex items-center gap-2">Start Timing <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /></span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
