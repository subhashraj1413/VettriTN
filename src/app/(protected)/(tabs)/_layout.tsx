import React from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppLanguage } from "../../../i18n/LanguageProvider";
import { useTheme } from "../../../hooks/useTheme";

type TabKey = "index" | "documents" | "chat" | "schemes";

const TAB_META: Record<
  TabKey,
  {
    icon: (
      focused: boolean,
      activeColor: string,
      inactiveColor: string,
    ) => React.ReactNode;
  }
> = {
  index: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? "home" : "home-outline"}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  documents: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? "document-text" : "document-text-outline"}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  chat: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? "sparkles" : "sparkles-outline"}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },

  schemes: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? "ribbon" : "ribbon-outline"}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
};

function TabIcon({
  label,
  icon,
  focused,
  primaryText,
  secondaryText,
}: {
  label: string;
  icon: React.ReactNode;
  focused: boolean;
  primaryText: string;
  secondaryText: string;
}) {
  return (
    <View className="w-36 mt-3 items-center justify-center gap-0 self-center">
      <View className="h-10 w-10 items-center justify-center rounded-md">
        {icon}
      </View>
      <Text
        className="text-[12px] font-medium"
        style={{ color: focused ? primaryText : secondaryText }}
      >
        {label}
      </Text>
    </View>
  );
}

function getScreenOptions(name: TabKey, bottomInset: number) {
  const { icon } = TAB_META[name];
  const tabBarBottomPadding = Math.max(bottomInset, 10);
  const titleMap = {
    index: "home",
    documents: "documents",
    chat: "chat",
    schemes: "schemes",
  } as const;
  const routeKey = titleMap[name];

  return (
    strings: ReturnType<typeof useAppLanguage>["strings"],
    theme: ReturnType<typeof useTheme>["theme"],
  ) => {
    const inactiveColor =
      theme.statusBarStyle === "dark-content"
        ? "rgba(93,69,0,0.58)"
        : "rgba(255,255,255,0.72)";

    return {
      title: strings.routes[routeKey],
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: theme.tabBar,
        borderTopWidth: 0,
        height: 54 + tabBarBottomPadding + 8,
        paddingBottom: tabBarBottomPadding,
        paddingTop: 8,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabIcon
          focused={focused}
          icon={icon(focused, theme.onAccent, inactiveColor)}
          label={strings.routes[routeKey]}
          primaryText={theme.onAccent}
          secondaryText={inactiveColor}
        />
      ),
    };
  };
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={getScreenOptions("index", insets.bottom)(strings, theme)}
      />
      <Tabs.Screen
        name="documents"
        options={getScreenOptions("documents", insets.bottom)(strings, theme)}
      />
      <Tabs.Screen
        name="chat"
        options={getScreenOptions("chat", insets.bottom)(strings, theme)}
      />

      <Tabs.Screen
        name="schemes"
        options={getScreenOptions("schemes", insets.bottom)(strings, theme)}
      />
    </Tabs>
  );
}
