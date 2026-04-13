import React from 'react';
import { Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '../../../i18n/LanguageProvider';
import { useTheme } from '../../../hooks/useTheme';

type TabKey = 'index' | 'documents' | 'chat' | 'grievances' | 'schemes';

const TAB_META: Record<
  TabKey,
  {
    icon: (focused: boolean, activeColor: string, inactiveColor: string) => React.ReactNode;
  }
> = {
  index: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? 'home' : 'home-outline'}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  documents: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? 'document-text' : 'document-text-outline'}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  chat: {
    icon: (focused, activeColor, inactiveColor) => (
      <MaterialCommunityIcons
        name={focused ? 'robot-happy' : 'robot-outline'}
        size={20}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  grievances: {
    icon: (focused, activeColor, inactiveColor) => (
      <Feather
        name="alert-triangle"
        size={18}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  schemes: {
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name={focused ? 'ribbon' : 'ribbon-outline'}
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
    <View className="w-16 items-center justify-center gap-1 self-center">
      <View
        className="h-8 w-10 items-center justify-center rounded-md"
        style={{ backgroundColor: focused ? "rgba(255,255,255,0.12)" : "transparent" }}
      >
        {icon}
      </View>
      <Text
        className="text-[10px] font-semibold"
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
    index: 'home',
    documents: 'documents',
    chat: 'chat',
    grievances: 'grievances',
    schemes: 'schemes',
  } as const;
  const routeKey = titleMap[name];

  return (
    strings: ReturnType<typeof useAppLanguage>['strings'],
    theme: ReturnType<typeof useTheme>['theme'],
  ) => ({
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
        icon={icon(focused, theme.accent, "rgba(255,255,255,0.72)")}
        label={strings.routes[routeKey]}
        primaryText={theme.accent}
        secondaryText="rgba(255,255,255,0.72)"
      />
    ),
  });
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={getScreenOptions('index', insets.bottom)(strings, theme)} />
      <Tabs.Screen
        name="documents"
        options={getScreenOptions('documents', insets.bottom)(strings, theme)}
      />
      <Tabs.Screen name="chat" options={getScreenOptions('chat', insets.bottom)(strings, theme)} />
      <Tabs.Screen
        name="grievances"
        options={getScreenOptions('grievances', insets.bottom)(strings, theme)}
      />
      <Tabs.Screen
        name="schemes"
        options={getScreenOptions('schemes', insets.bottom)(strings, theme)}
      />
    </Tabs>
  );
}
