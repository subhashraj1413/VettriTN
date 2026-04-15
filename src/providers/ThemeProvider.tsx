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
  headerBackground: string;
  headerText: string;
  headerSubText: string;
  headerChrome: string;
  statusBarStyle: 'light-content' | 'dark-content';
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
  headerBackground: TVKColors.primary,
  headerText: TVKColors.white,
  headerSubText: 'rgba(255,255,255,0.78)',
  headerChrome: 'rgba(255,255,255,0.14)',
  statusBarStyle: 'light-content',
};

const darkTheme: ThemeTokens = {
  background: '#121212',
  surface: '#1C1C1E',
  card: '#242427',
  border: '#3A3A3E',
  primaryText: '#7F8895',
  secondaryText: '#C5C5C8',
  accent: TVKColors.yellow,
  tabBar: '#1F0D10',
  onAccent: '#1A1A1A',
  headerBackground: '#D6A40C',
  headerText: '#1A1A1A',
  headerSubText: 'rgba(26,26,26,0.72)',
  headerChrome: 'rgba(0,0,0,0.14)',
  statusBarStyle: 'dark-content',
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
