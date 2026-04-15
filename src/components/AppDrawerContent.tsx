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
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  match: string[];
};

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { language, setLanguage, strings } = useAppLanguage();
  const { signOut } = useSession();
  const { mode, setMode, theme } = useTheme();

  const isDark = mode === 'dark';

  const navItems: DrawerItem[] = [
    {
      label: strings.routes.home,
      href: '/' as Href,
      icon: 'home-outline',
      activeIcon: 'home',
      match: ['/', '/(tabs)'],
    },
    {
      label: strings.routes.documents,
      href: '/documents' as Href,
      icon: 'document-text-outline',
      activeIcon: 'document-text',
      match: ['/documents'],
    },
    {
      label: strings.routes.chat,
      href: '/chat' as Href,
      icon: 'chatbubble-ellipses-outline',
      activeIcon: 'chatbubble-ellipses',
      match: ['/chat'],
    },
    {
      label: strings.routes.grievances,
      href: '/grievances' as Href,
      icon: 'alert-circle-outline',
      activeIcon: 'alert-circle',
      match: ['/grievances'],
    },
    {
      label: strings.routes.schemes,
      href: '/schemes' as Href,
      icon: 'ribbon-outline',
      activeIcon: 'ribbon',
      match: ['/schemes'],
    },
    {
      label: strings.routes.citizenId,
      href: '/citizen-id' as Href,
      icon: 'card-outline',
      activeIcon: 'card',
      match: ['/citizen-id'],
    },
    {
      label: strings.routes.services,
      href: '/services' as Href,
      icon: 'grid-outline',
      activeIcon: 'grid',
      match: ['/services'],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: theme.accent,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="shield-checkmark" size={20} color={theme.onAccent} />
          </View>
          <Text style={{ color: theme.onAccent, fontSize: 20, fontWeight: '800', letterSpacing: 0.2 }}>
            {strings.drawer.title}
          </Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 48 }}>
          {strings.drawer.subtitle}
        </Text>
      </View>

      {/* ── Nav items (scrollable) ──────────────────────────── */}
      <DrawerContentScrollView
        {...props}
        bounces={false}
        style={{ flex: 1 }}
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 16,
                paddingLeft: 0,
                paddingVertical: 4,
                marginBottom: 2,
              }}
            >
              {/* Active left-bar indicator */}
              <View
                style={{
                  width: 3,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: active ? theme.accent : 'transparent',
                  marginRight: 13,
                }}
              />

              {/* Icon badge */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: active
                    ? theme.accent + '18'
                    : isChat
                      ? isDark ? 'rgba(255,200,0,0.10)' : 'rgba(196,30,58,0.07)'
                      : theme.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={21}
                  color={
                    active
                      ? theme.accent
                      : isChat
                        ? theme.accent
                        : theme.secondaryText
                  }
                />
                {/* AI sparkle badge */}
                {isChat && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: theme.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="sparkles" size={8} color={theme.onAccent} />
                  </View>
                )}
              </View>

              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: active ? '700' : '400',
                  color: active ? theme.accent : theme.primaryText,
                  letterSpacing: 0.1,
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

      {/* ── Footer — 4 items ───────────────────────────────── */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.surface,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        {/* 1. Language */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="language-outline" size={18} color={theme.secondaryText} />
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.primaryText }}>
              {strings.drawer.language}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: 'hidden',
            }}
          >
            {([
              { code: 'en', label: strings.drawer.english },
              { code: 'ta', label: strings.drawer.tamil },
            ] as const).map(opt => {
              const active = language === opt.code;
              return (
                <TouchableOpacity
                  key={opt.code}
                  onPress={() => setLanguage(opt.code)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    backgroundColor: active ? theme.accent : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: active ? theme.onAccent : theme.secondaryText,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Theme toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons
              name={isDark ? 'moon-outline' : 'sunny-outline'}
              size={18}
              color={theme.secondaryText}
            />
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.primaryText }}>
              {isDark ? strings.drawer.dark : strings.drawer.light}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={v => setMode(v ? 'dark' : 'light')}
            trackColor={{ false: theme.border, true: theme.accent + 'CC' }}
            thumbColor={isDark ? theme.accent : '#FFFFFF'}
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="person-circle-outline" size={18} color={theme.secondaryText} />
          <Text style={{ fontSize: 13, fontWeight: '500', color: theme.primaryText }}>
            {strings.routes.profile}
          </Text>
        </TouchableOpacity>

        {/* 4. Sign Out */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            signOut();
            props.navigation.closeDrawer();
            router.replace('/login' as Href);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#C62828" />
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#C62828' }}>
            {strings.drawer.signOut}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
