import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AppThemeMode, readThemeMode, writeThemeMode } from '../lib/storage/preferencesStorage';
import { TVKColors } from '../theme';

export type ThemeTokens = {
  background: string;
  surface: string;
  card: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  tabBar: string;
  onAccent: string;
};

const lightTheme: ThemeTokens = {
  background: TVKColors.background,
  surface: TVKColors.surface,
  card: TVKColors.white,
  border: TVKColors.border,
  primaryText: TVKColors.textPrimary,
  secondaryText: TVKColors.textSecondary,
  accent: TVKColors.primary,
  tabBar: TVKColors.maroon,
  onAccent: TVKColors.textInverse,
};

const darkTheme: ThemeTokens = {
  background: '#121212',
  surface: '#1C1C1E',
  card: '#242427',
  border: '#3A3A3E',
  primaryText: '#F5F5F5',
  secondaryText: '#C5C5C8',
  accent: TVKColors.yellow,
  tabBar: '#1F0D10',
  onAccent: '#1A1A1A',
};

type ThemeContextValue = {
  mode: AppThemeMode;
  theme: ThemeTokens;
  setMode: (nextMode: AppThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<AppThemeMode>(systemMode);

  useEffect(() => {
    readThemeMode()
      .then(stored => {
        if (stored) {
          setModeState(stored);
          return;
        }

        setModeState(systemMode);
      })
      .catch(() => undefined);
  }, [systemMode]);

  const setMode = (nextMode: AppThemeMode) => {
    setModeState(nextMode);
    writeThemeMode(nextMode).catch(() => undefined);
  };

  const value = useMemo(
    () => ({
      mode,
      theme: mode === 'dark' ? darkTheme : lightTheme,
      setMode,
      toggleTheme: () => setMode(mode === 'dark' ? 'light' : 'dark'),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }

  return context;
}
