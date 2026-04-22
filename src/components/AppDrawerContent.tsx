import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Href, router, usePathname } from 'expo-router';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '../features/auth/hooks/useSession';
import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';

type DrawerItem = {
  label:      string;
  href:       Href;
  icon:       keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  match:      string[];
};

/**
 * Side-drawer navigation content.
 * Fully rewritten to use NativeWind className.
 * Dynamic theme colours kept as inline `style` props only where necessary.
 */
export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { language, setLanguage, strings } = useAppLanguage();
  const { signOut } = useSession();
  const { mode, setMode, theme } = useTheme();
  const isModern = mode === 'modern';

  const navItems: DrawerItem[] = [
    { label: strings.routes.home,       href: '/' as Href,           icon: 'home-outline',               activeIcon: 'home',               match: ['/', '/(tabs)'] },
    { label: strings.routes.documents,  href: '/documents' as Href,   icon: 'document-text-outline',      activeIcon: 'document-text',      match: ['/documents'] },
    { label: strings.routes.chat,       href: '/chat' as Href,        icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses', match: ['/chat'] },
    { label: strings.routes.grievances, href: '/grievances' as Href,  icon: 'alert-circle-outline',       activeIcon: 'alert-circle',       match: ['/grievances'] },
    { label: strings.routes.schemes,    href: '/schemes' as Href,     icon: 'ribbon-outline',             activeIcon: 'ribbon',             match: ['/schemes'] },
    { label: strings.routes.citizenId,  href: '/citizen-id' as Href,  icon: 'card-outline',               activeIcon: 'card',               match: ['/citizen-id'] },
    { label: strings.routes.services,   href: '/services' as Href,    icon: 'grid-outline',               activeIcon: 'grid',               match: ['/services'] },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View
        className="px-5 pb-6"
        style={{
          backgroundColor: theme.accent,
          paddingTop: insets.top + 10,
        }}
      >
        <View className="flex-row items-center gap-2.5 mb-1.5">
          <View
            className="w-9 h-9 rounded-[10px] items-center justify-center"
            style={{ backgroundColor: theme.headerChrome }}
          >
            <Ionicons name="shield-checkmark" size={20} color={theme.onAccent} />
          </View>
          <Text
            className="text-[20px] font-extrabold tracking-[0.2px]"
            style={{ color: theme.onAccent }}
          >
            {strings.drawer.title}
          </Text>
        </View>
        <Text
          className="text-[13px] ml-[46px]"
          style={{ color: theme.onAccent, opacity: 0.7 }}
        >
          {strings.drawer.subtitle}
        </Text>
      </View>

      {/* ── Nav items ───────────────────────────────────────────────────── */}
      <DrawerContentScrollView
        {...props}
        bounces={false}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
      >
        {navItems.map(item => {
          const active = item.match.includes(pathname);
          const isChat = item.match.includes('/chat');

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.75}
              onPress={() => {
                router.push(item.href);
                props.navigation.closeDrawer();
              }}
              className="flex-row items-center pr-4 py-1 mb-0.5"
            >
              {/* Active left-bar indicator */}
              <View
                className="w-[3px] h-11 rounded-sm mr-3"
                style={{ backgroundColor: active ? theme.accent : 'transparent' }}
              />

              {/* Icon badge */}
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3.5"
                style={{
                  backgroundColor: active
                    ? `${theme.accent}18`
                    : isChat
                      ? isModern ? 'rgba(255,200,0,0.10)' : 'rgba(139,0,0,0.07)'
                      : theme.surface,
                }}
              >
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={21}
                  color={active ? theme.accent : isChat ? theme.accent : theme.secondaryText}
                />

                {/* AI sparkle badge on Chat */}
                {isChat && (
                  <View
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <Ionicons name="sparkles" size={8} color={theme.onAccent} />
                  </View>
                )}
              </View>

              <Text
                className="flex-1 text-[15px] tracking-[0.1px]"
                style={{
                  fontWeight: active ? '700' : '400',
                  color: active ? theme.accent : theme.primaryText,
                }}
              >
                {item.label}
              </Text>

              {active && (
                <Ionicons name="chevron-forward" size={15} color={theme.accent} />
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <View
        className="border-t"
        style={{
          borderTopColor:    theme.border,
          backgroundColor:   theme.surface,
          paddingBottom:     Math.max(insets.bottom, 16),
        }}
      >
        {/* 1. Language toggle */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2.5">
          <View className="flex-row items-center gap-2.5">
            <Ionicons name="language-outline" size={18} color={theme.secondaryText} />
            <Text className="text-[13px] font-medium" style={{ color: theme.primaryText }}>
              {strings.drawer.language}
            </Text>
          </View>
          <View
            className="flex-row rounded-lg border overflow-hidden"
            style={{ borderColor: theme.border }}
          >
            {([
              { code: 'en' as const, label: strings.drawer.english },
              { code: 'ta' as const, label: strings.drawer.tamil },
            ]).map(opt => {
              const langActive = language === opt.code;
              return (
                <TouchableOpacity
                  key={opt.code}
                  onPress={() => setLanguage(opt.code)}
                  className="px-3.5 py-1.5"
                  style={{ backgroundColor: langActive ? theme.accent : 'transparent' }}
                >
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: langActive ? theme.onAccent : theme.secondaryText }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Classic / Modern theme toggle */}
        <View className="flex-row items-center justify-between px-5 py-2.5">
          <View className="flex-row items-center gap-2.5">
            <View
              className="w-8 h-8 rounded-full items-center justify-center border"
              style={{
                backgroundColor: isModern ? `${theme.accent}26` : theme.headerChrome,
                borderColor: isModern ? `${theme.accent}66` : theme.border,
              }}
            >
              <Ionicons
                name={isModern ? 'color-wand-outline' : 'library-outline'}
                size={16}
                color={isModern ? theme.onAccent : theme.secondaryText}
              />
            </View>
            <Text className="text-[13px] font-medium" style={{ color: theme.primaryText }}>
              {isModern ? strings.drawer.modern : strings.drawer.classic}
            </Text>
          </View>
          <Switch
            value={isModern}
            onValueChange={v => setMode(v ? 'modern' : 'classic')}
            trackColor={{ false: theme.border, true: `${theme.accent}CC` }}
            thumbColor={isModern ? theme.accent : '#FFFFFF'}
            ios_backgroundColor={theme.border}
          />
        </View>

        {/* 3. Profile */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            router.push('/profile' as Href);
            props.navigation.closeDrawer();
          }}
          className="flex-row items-center gap-2.5 px-5 py-2.5"
        >
          <Ionicons name="person-circle-outline" size={18} color={theme.secondaryText} />
          <Text className="text-[13px] font-medium" style={{ color: theme.primaryText }}>
            {strings.routes.profile}
          </Text>
        </TouchableOpacity>

        {/* 4. Sign out */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            signOut();
            props.navigation.closeDrawer();
            router.replace('/login' as Href);
          }}
          className="flex-row items-center gap-2.5 px-5 py-2.5"
        >
          <Ionicons name="log-out-outline" size={18} color={theme.headerBackground} />
          <Text className="text-[13px] font-semibold" style={{ color: theme.headerBackground }}>
            {strings.drawer.signOut}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
