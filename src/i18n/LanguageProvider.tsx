import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { AppLanguage, AppStrings, translations } from './translations';

const STORAGE_KEY = 'vettri.language';

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  strings: AppStrings;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value === 'en' || value === 'ta') {
          setLanguageState(value);
        }
      })
      .catch(() => undefined);
  }, []);

  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    AsyncStorage.setItem(STORAGE_KEY, nextLanguage).catch(() => undefined);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      strings: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useAppLanguage must be used within LanguageProvider');
  }

  return context;
}
