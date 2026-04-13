import { Href, Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useSession } from "../features/auth/hooks/useSession";
import { useTheme } from "../hooks/useTheme";

export default function IndexRoute() {
  const { hydrated, isAuthenticated } = useSession();
  const { theme } = useTheme();

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href={"/login" as Href} />;
}
