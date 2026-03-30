import { useStore } from '../store/useStore';
import { format, parseISO, isSameDay, addHours, startOfDay, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DayView() {
  const { currentDate, setCurrentDate, events, searchQuery } = useStore();

  const prevDay = () => setCurrentDate(subDays(parseISO(currentDate), 1).toISOString());
  const nextDay = () => setCurrentDate(addDays(parseISO(currentDate), 1).toISOString());

  const dayEvents = events.filter(e => isSameDay(parseISO(e.startTime), parseISO(currentDate)) && e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const hours = Array.from({ length: 24 }).map((_, i) => addHours(startOfDay(parseISO(currentDate)), i));

  const renderHeader = () => {
    const dateFormat = "EEEE, MMMM d, yyyy";
    return (
      <div className="flex justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={prevDay} className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <motion.h2 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold tracking-tight min-w-[200px]"
          >
            {format(parseISO(currentDate), dateFormat)}
          </motion.h2>
          <button onClick={nextDay} className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-accent/90 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto">
      {renderHeader()}
      <div className="flex-1 overflow-y-auto bg-card rounded-3xl border border-border/50 shadow-xl shadow-black/5 flex flex-col relative px-8 pb-10 custom-scrollbar">
        {hours.map((hour, idx) => {
          const formattedHour = format(hour, 'h a');
          const eventsInHour = dayEvents.filter(e => {
            const startHour = new Date(e.startTime).getHours();
            return startHour === hour.getHours();
          });

          return (
            <div key={idx} className="flex min-h-[100px] border-b border-border/40 group">
              <div className="w-20 pr-4 text-right pt-2 border-r border-border/40">
                <span className="text-sm font-semibold text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">{formattedHour}</span>
              </div>
              <div className="flex-1 relative pl-4 p-2">
                <div className="h-full w-full opacity-0 group-hover:opacity-100 bg-muted/5 transition-opacity rounded-xl" />
                {eventsInHour.map(e => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={e.id}
                    className="absolute inset-y-2 left-4 right-4 rounded-xl p-3 border border-black/5 dark:border-white/5 shadow-md flex items-center justify-between z-10 hover:z-20 hover:scale-[1.01] transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                    style={{ backgroundColor: `${e.color}20`, borderLeft: `6px solid ${e.color}` }}
                  >
                    <div className="flex flex-col gap-1 z-10 relative pointer-events-none">
                      <span className="font-bold text-foreground text-[15px]">{e.title}</span>
                      <span className="text-xs text-muted-foreground font-medium opacity-80 mix-blend-multiply dark:mix-blend-screen">{format(new Date(e.startTime), 'h:mm a')} - {format(new Date(e.endTime), 'h:mm a')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
