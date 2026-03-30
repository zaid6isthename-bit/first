import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, CalendarEvent, Task, ViewMode } from '../types';
import { addDays, startOfToday, subDays, addHours } from 'date-fns';

const today = startOfToday().toISOString();
const tomorrow = addDays(startOfToday(), 1).toISOString();
const yesterday = subDays(startOfToday(), 1).toISOString();

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Sync',
    description: 'Weekly team sync to discuss goals',
    startTime: addHours(startOfToday(), 10).toISOString(),
    endTime: addHours(startOfToday(), 11).toISOString(),
    color: '#3b82f6',
    tags: ['Work', 'Meeting'],
  },
  {
    id: '2',
    title: 'Product Design Review',
    description: 'Review new mockups for Q3',
    startTime: addHours(startOfToday(), 14).toISOString(),
    endTime: addHours(startOfToday(), 15).toISOString(),
    color: '#8b5cf6',
    tags: ['Design'],
  },
  {
    id: '3',
    title: 'Lunch with Client',
    startTime: addHours(addDays(startOfToday(), 1), 12).toISOString(),
    endTime: addHours(addDays(startOfToday(), 1), 13).toISOString(),
    color: '#10b981',
    tags: ['Client', 'Social'],
  }
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Update project documentation',
    completed: false,
    priority: 'medium',
    deadline: today
  },
  {
    id: '2',
    title: 'Prepare slides for all-hands',
    completed: true,
    priority: 'high',
    deadline: yesterday
  },
  {
    id: '3',
    title: 'Review pull requests',
    completed: false,
    priority: 'low',
    deadline: tomorrow
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      events: initialEvents,
      tasks: initialTasks,
      theme: 'dark',
      currentDate: new Date().toISOString(),
      viewMode: 'month',
      searchQuery: '',
      
      setTheme: (theme) => set({ theme }),
      setCurrentDate: (currentDate) => set({ currentDate }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updated) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updated } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updated) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updated } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
    }),
    {
      name: 'calendar-storage',
    }
  )
);
