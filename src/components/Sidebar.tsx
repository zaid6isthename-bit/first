import { Calendar as CalendarIcon, ListTodo, Search, Settings, Moon, Sun, Activity, SearchIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { theme, setTheme, viewMode, setViewMode, searchQuery, setSearchQuery } = useStore();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <motion.aside 
      initial={{ width: 0 }}
      animate={{ width: 260 }}
      className="h-full border-r border-border bg-card/80 backdrop-blur-md flex flex-col p-4 shadow-sm z-20"
    >
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-xl shadow-lg ring-1 ring-white/10">
          <CalendarIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">TimeFlow App</span>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <input 
          type="text" 
          placeholder="Search items..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <nav className="flex-1 space-y-2">
        <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Views</div>
        
        <SidebarItem 
          icon={<CalendarIcon className="w-4 h-4" />} 
          label="Detailed Calendar" 
          active={viewMode !== 'focus' && viewMode !== 'day'}
          onClick={() => setViewMode('month')}
        />
        <SidebarItem 
          icon={<ListTodo className="w-4 h-4" />} 
          label="Today's Overview" 
          active={viewMode === 'day'}
          onClick={() => setViewMode('day')}
        />
         <SidebarItem 
          icon={<Activity className="w-4 h-4" />} 
          label="Hyper Focus" 
          active={viewMode === 'focus'}
          onClick={() => setViewMode('focus')}
        />
      </nav>

      <div className="pt-4 mt-4 border-t border-border flex flex-col gap-2">
        <SidebarItem 
          icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} 
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} 
          onClick={toggleTheme}
        />
        <SidebarItem 
          icon={<Settings className="w-4 h-4" />} 
          label="Settings" 
          onClick={() => {}}
        />
      </div>
    </motion.aside>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        active 
          ? "bg-accent/10 text-accent" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  )
}
