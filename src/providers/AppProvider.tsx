import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '../i18n/LanguageProvider';
import { store } from '../lib/store';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
