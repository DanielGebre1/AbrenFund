import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const { theme, setTheme } = useAuthStore();

  useEffect(() => {
    // Initialize theme if not set
    if (!theme) {
      const savedTheme = localStorage.getItem('theme');
      const preferredTheme = savedTheme || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(preferredTheme);
    }

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}