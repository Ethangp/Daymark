import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSampleEvents } from '../constants/sampleEvents';
import type { GradientTheme } from '../constants/themes';

export interface CountdownEvent {
  id: string;
  title: string;
  emoji: string;
  targetDate: string;
  createdDate: string;
  startDate?: string;
  color: GradientTheme;
  category: 'vacation' | 'birthday' | 'exam' | 'holiday' | 'fitness' | 'custom';
  isCountUp: boolean;
  isPinned: boolean;
  size: 'small' | 'medium' | 'large';
}

interface EventsContextType {
  events: CountdownEvent[];
  isLoading: boolean;
  addEvent: (event: CountdownEvent) => void;
  updateEvent: (event: CountdownEvent) => void;
  deleteEvent: (id: string) => void;
  togglePin: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const STORAGE_KEY = '@daymark_events';
const INITIALIZED_KEY = '@daymark_initialized';

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        setEvents(JSON.parse(stored));
      } else if (!initialized) {
        const samples = getSampleEvents();
        setEvents(samples);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
        await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
      }
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = useCallback(async (updated: CountdownEvent[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save events:', e);
    }
  }, []);

  const addEvent = useCallback((event: CountdownEvent) => {
    setEvents((prev) => {
      const updated = [event, ...prev];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const updateEvent = useCallback((event: CountdownEvent) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === event.id ? event : e));
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const togglePin = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, isPinned: !e.isPinned } : e
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  return (
    <EventsContext.Provider
      value={{ events, isLoading, addEvent, updateEvent, deleteEvent, togglePin }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}
