import { CheckCircle2, Circle, Plus, AlertCircle, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

export default function TaskSidebar() {
  const { tasks, toggleTaskCompletion, addTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    addTask({
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      deadline: new Date().toISOString()
    });
    setNewTaskTitle('');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime();
  });

  return (
    <aside className="w-80 h-full border-l border-border bg-card/80 backdrop-blur-md flex flex-col pt-4 shadow-sm z-20">
      <div className="px-5 mb-4 border-b border-border pb-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          Tasks <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => !t.completed).length} remaining</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
        {sortedTasks.map(task => (
          <div 
            key={task.id} 
            className="group flex gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/80 transition-all cursor-pointer"
            onClick={() => toggleTaskCompletion(task.id)}
          >
            <button className={cn("mt-0.5 transition-colors flex-shrink-0", task.completed ? "text-green-500" : "text-muted-foreground hover:text-accent")}>
              {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium transition-all line-clamp-2", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </p>
              {task.deadline && (
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-medium">
                  {task.priority === 'high' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                  {task.priority === 'medium' && <Clock className="w-3.5 h-3.5 text-yellow-500" />}
                  <span className={isPast(new Date(task.deadline)) && !task.completed ? "text-red-500 font-semibold" : ""}>
                    {isToday(new Date(task.deadline)) ? 'Today' : isTomorrow(new Date(task.deadline)) ? 'Tomorrow' : format(new Date(task.deadline), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {sortedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-10 px-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-medium text-sm">You're all caught up!</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background/50">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Add new task..." 
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-card border border-border px-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!newTaskTitle.trim()}
            className="bg-accent text-white p-2.5 rounded-xl disabled:opacity-50 hover:bg-accent/90 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
