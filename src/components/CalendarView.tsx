import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarView() {
  const { viewMode, currentDate, setCurrentDate, events, searchQuery } = useStore();
  const [direction, setDirection] = useState(0);

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(parseISO(currentDate), 1).toISOString());
  };
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(parseISO(currentDate), 1).toISOString());
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <motion.h2 
            key={currentDate} 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold tracking-tight min-w-[200px] text-center"
          >
            {format(parseISO(currentDate), dateFormat)}
          </motion.h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
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

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(parseISO(currentDate));
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col-center text-sm font-semibold text-muted-foreground uppercase tracking-wider py-3" key={i}>
          {format(addDays(startDate, i), dateFormat).substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-border/50 bg-background/50 sticky top-0 z-10 backdrop-blur-md rounded-t-2xl">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(parseISO(currentDate));
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const activeEvents = events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        const dayEvents = activeEvents.filter(e => isSameDay(parseISO(e.startTime), cloneDay));

        days.push(
          <div
            className={cn(
              "p-2 border-r border-b border-border/50 min-h-[140px] flex flex-col gap-1 transition-all group hover:bg-muted/10",
              !isSameMonth(day, monthStart) ? "bg-muted/5 text-muted-foreground/30 font-medium" : "text-foreground font-semibold bg-card",
              isSameDay(day, new Date()) ? "ring-2 ring-accent/30 ring-inset relative overflow-hidden bg-accent/5" : ""
            )}
            key={day.toISOString()}
            onClick={() => {}}
          >
            <div className="flex justify-between items-start mb-2 px-1 pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <span className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-sm",
                isSameDay(day, new Date()) ? "bg-accent text-white font-bold shadow-md shadow-accent/20" : "group-hover:bg-muted"
              )}>
                {formattedDate}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 px-0.5 no-scrollbar">
              {dayEvents.map((evt) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={evt.id}
                  className="px-2.5 py-1.5 text-xs rounded-lg cursor-pointer truncate font-medium transition-all hover:brightness-110 shadow-sm border border-black/5 dark:border-white/5"
                  style={{ backgroundColor: `${evt.color}20`, color: evt.color }}
                  title={evt.title}
                >
                  {evt.title}
                </motion.div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div 
          key={currentDate}
          custom={direction}
          initial={{ x: direction * 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-card w-full h-full flex flex-col rounded-b-3xl border-x border-b border-border/50 shadow-sm"
        >
          {rows}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full h-full flex flex-col max-w-[1600px] mx-auto">
      {renderHeader()}
      <div className="flex-1 overflow-hidden flex flex-col rounded-3xl border border-border/50 bg-card shadow-xl shadow-black/5 dark:shadow-black/20">
        {renderDays()}
        <div className="flex-1 overflow-y-auto bg-muted/20">
          {renderCells()}
        </div>
      </div>
    </div>
  );
}
