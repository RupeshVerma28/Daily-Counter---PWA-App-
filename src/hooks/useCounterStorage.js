import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';

const STORAGE_KEY = 'counter_game_v1';

export function useCounterStorage() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = {
      count: 0,
      lastDate: format(new Date(), 'yyyy-MM-dd'),
      history: []
    };
    return saved ? JSON.parse(saved) : initial;
  });

  const isInitialMount = useRef(true);

  // Daily Reset Check on Mount
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');

    if (data.lastDate !== today) {
      if (data.count > 0) {
        setData(prev => ({
          count: 0,
          lastDate: today,
          history: [
            { date: prev.lastDate, count: prev.count },
            ...prev.history
          ]
        }));
      } else {
        setData(prev => ({ ...prev, lastDate: today }));
      }
    }
  }, []); // Run only on mount

  // Debounced Persistence
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 1000); // Wait 1s of inactivity before writing to disk

    return () => clearTimeout(handler);
  }, [data]);

  const increment = useCallback(() => {
    setData(prev => ({ ...prev, count: prev.count + 1 }));
  }, []);

  const resetCount = useCallback(() => {
    setData(prev => ({ ...prev, count: 0 }));
  }, []);

  const setCount = useCallback((newCount) => {
    setData(prev => ({ ...prev, count: newCount }));
  }, []);

  return {
    count: data.count,
    increment,
    resetCount,
    setCount,
    history: data.history,
    lastDate: data.lastDate
  };
}
