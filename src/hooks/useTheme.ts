import { useEffect } from 'react';
import useStore from '@/store';

export default function useTheme() {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    // Update the class on the document element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return { darkMode, toggleDarkMode };
} 