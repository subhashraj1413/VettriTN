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

/**
 * Classic Theme — Heritage Tamil Nadu government aesthetic.
 * Uses deep TVK Maroon (#8B0000) as the primary chrome colour,
 * warm parchment backgrounds and gold-tinged surfaces for a
 * formal, dignified feel. All colours remain within the official
 * TVK palette (maroon / red / golden yellow).
 */
const classicTheme: ThemeTokens = {
  background:       '#F9F4EE',          // warm parchment — aged-paper warmth
  surface:          TVKColors.white,
  card:             '#FEFAF5',          // warm-white card
  border:           '#D8CCBB',          // warm sandstone border
  primaryText:      '#1C120A',          // deep warm ink
  secondaryText:    '#5C4D3C',          // medium warm brown
  accent:           TVKColors.maroon,   // TVK deep maroon — formal accent
  tabBar:           '#6B0000',          // darker maroon tab rail
  onAccent:         TVKColors.textInverse,
  headerBackground: TVKColors.maroon,   // deep maroon header (heritage gov look)
  headerText:       TVKColors.white,
  headerSubText:    'rgba(255,255,255,0.72)',
  headerChrome:     'rgba(0,0,0,0.14)',
  statusBarStyle:   'light-content',
};

/**
 * Modern Theme — Contemporary civic-tech style.
 * Uses vibrant TVK Red (#9F0000) as the primary chrome and
 * golden TVK Yellow (#F5C518) as the accent with warm-neutral
 * surfaces to keep the full UI inside the TVK visual language.
 */
const modernTheme: ThemeTokens = {
  background:       TVKColors.background,
  surface:          TVKColors.white,
  card:             TVKColors.white,
  border:           TVKColors.border,
  primaryText:      TVKColors.textPrimary,
  secondaryText:    TVKColors.textSecondary,
  accent:           TVKColors.yellow,      // TVK golden yellow — modern pop
  tabBar:           TVKColors.yellow,      // yellow theme footer/tab rail
  onAccent:         TVKColors.textOnYellow,
  headerBackground: TVKColors.yellow,      // yellow theme header
  headerText:       TVKColors.textOnYellow,
  headerSubText:    'rgba(93,69,0,0.82)',
  headerChrome:     'rgba(93,69,0,0.12)',
  statusBarStyle:   'dark-content',
};

type ThemeContextValue = {
  mode: AppThemeMode;
  theme: ThemeTokens;
  setMode: (nextMode: AppThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // System dark → modern, system light → classic
  const systemMode: AppThemeMode = useColorScheme() === 'dark' ? 'modern' : 'classic';
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
      theme: mode === 'modern' ? modernTheme : classicTheme,
      setMode,
      toggleTheme: () => setMode(mode === 'modern' ? 'classic' : 'modern'),
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
