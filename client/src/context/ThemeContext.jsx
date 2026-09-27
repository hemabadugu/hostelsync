import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isNight, setIsNight] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 3-second cinematic sequence
    setTimeout(() => {
      setIsNight(prev => !prev);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }, 1500);
  };

  return (
    <ThemeContext.Provider value={{ isNight, isTransitioning, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
