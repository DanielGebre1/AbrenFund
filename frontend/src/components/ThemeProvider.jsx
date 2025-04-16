// import { createContext, useContext, useEffect, useState } from "react";

// const initialState = {
//   theme: "system",
//   setTheme: () => null,
// };

// const ThemeProviderContext = createContext(initialState);

// export function ThemeProvider({
//   children,
//   defaultTheme = "system",
//   storageKey = "abren-fund-theme",
//   ...props
// }) {
//   const [theme, setTheme] = useState(() => {
//     return localStorage.getItem(storageKey) || defaultTheme;
//   });

//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove("light", "dark");

//     if (theme === "system") {
//       // Always use light theme regardless of system preference
//       root.classList.add("light");
//       return;
//     }

//     root.classList.add(theme);
//   }, [theme]);

//   // Listen for changes in system preference, but always apply light theme
//   useEffect(() => {
//     if (theme === "system") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
//       const handleChange = () => {
//         const root = window.document.documentElement;
//         root.classList.remove("dark");
//         root.classList.add("light");
//       };
      
//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }
//   }, [theme]);

//   const value = {
//     theme,
//     setTheme: (theme) => {
//       localStorage.setItem(storageKey, theme);
//       setTheme(theme);
//     },
//   };

//   return (
//     <ThemeProviderContext.Provider {...props} value={value}>
//       {children}
//     </ThemeProviderContext.Provider>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeProviderContext);

//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }

//   return context;
// };

// ThemeProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

// ✅ Add this hook
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
