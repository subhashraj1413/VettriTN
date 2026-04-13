import "../../global.css";

import React, { useState } from "react";
import { Stack } from "expo-router";

import { useTheme } from "../hooks/useTheme";
import { AppProvider } from "../providers/AppProvider";
import SplashScreen from "../screens/SplashScreen";

function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
