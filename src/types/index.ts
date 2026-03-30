export type ViewMode = 'day' | 'week' | 'month' | 'focus';

export type Priority = 'low' | 'medium' | 'high';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  color: string;
  tags: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  reminder?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string; // ISO string
  priority: Priority;
}

export interface AppState {
  events: CalendarEvent[];
  tasks: Task[];
  theme: 'dark' | 'light';
  currentDate: string; // ISO string to track the focused date
  viewMode: ViewMode;
  searchQuery: string;
  
  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrentDate: (date: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updated: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
}
