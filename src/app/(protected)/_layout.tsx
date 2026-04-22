import { Href, Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import AppDrawerContent from "../../components/AppDrawerContent";
import { useSession } from "../../features/auth/hooks/useSession";
import { useAppLanguage } from "../../i18n/LanguageProvider";
import { useTheme } from "../../hooks/useTheme";

export default function ProtectedLayout() {
  const { hydrated, isAuthenticated } = useSession();
  const { strings } = useAppLanguage();
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

  if (!isAuthenticated) {
    return <Redirect href={"/login" as Href} />;
  }

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.3)",
        sceneStyle: { backgroundColor: theme.background },
        drawerStyle: {
          width: 304,
          padding: 0,
          backgroundColor: theme.surface,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: strings.routes.home }}
      />
      <Drawer.Screen
        name="citizen-id"
        options={{ drawerLabel: strings.routes.citizenId }}
      />
      <Drawer.Screen
        name="services"
        options={{ drawerLabel: strings.routes.services }}
      />
      <Drawer.Screen
        name="payments"
        options={{ drawerLabel: strings.routes.payments }}
      />
      <Drawer.Screen
        name="profile"
        options={{ drawerLabel: strings.routes.profile }}
      />
    </Drawer>
  );
}
