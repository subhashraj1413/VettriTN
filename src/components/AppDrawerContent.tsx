import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Href, router, usePathname } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '../features/auth/hooks/useSession';
import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';

type DrawerItem = {
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  match: string[];
};

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { language, setLanguage, strings } = useAppLanguage();
  const { signOut } = useSession();
  const { mode, setMode, theme } = useTheme();

  const items: DrawerItem[] = [
    {
      label: strings.routes.home,
      href: '/' as Href,
      icon: 'home-outline',
      match: ['/', '/(tabs)'],
    },
    {
      label: strings.routes.documents,
      href: '/documents' as Href,
      icon: 'document-text-outline',
      match: ['/documents'],
    },
    {
      label: strings.routes.chat,
      href: '/chat' as Href,
      icon: 'sparkles-outline',
      match: ['/chat'],
    },
    {
      label: strings.routes.grievances,
      href: '/grievances' as Href,
      icon: 'alert-circle-outline',
      match: ['/grievances'],
    },
    {
      label: strings.routes.schemes,
      href: '/schemes' as Href,
      icon: 'ribbon-outline',
      match: ['/schemes'],
    },
    {
      label: strings.routes.citizenId,
      href: '/citizen-id' as Href,
      icon: 'card-outline',
      match: ['/citizen-id'],
    },
    {
      label: strings.routes.services,
      href: '/services' as Href,
      icon: 'grid-outline',
      match: ['/services'],
    },
    {
      label: strings.routes.profile,
      href: '/profile' as Href,
      icon: 'person-outline',
      match: ['/profile'],
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 0,
        width: '100%',
        backgroundColor: theme.background,
      }}
    >
      <View
        style={{
          backgroundColor: theme.accent,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 22,
        }}
      >
        <Text style={{ color: theme.onAccent, fontSize: 24, fontWeight: '700' }}>
          {strings.drawer.title}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {strings.drawer.subtitle}
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 11,
            fontWeight: '700',
            marginTop: 18,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
        >
          {strings.drawer.language}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {([
            { code: 'en', label: strings.drawer.english },
            { code: 'ta', label: strings.drawer.tamil },
          ] as const).map(option => {
            const active = language === option.code;

            return (
              <TouchableOpacity
                key={option.code}
                activeOpacity={0.85}
                onPress={() => setLanguage(option.code)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 8,
                  backgroundColor: active ? theme.onAccent : 'rgba(255,255,255,0.12)',
                }}
              >
                <Text
                  style={{
                    color: active ? theme.accent : theme.onAccent,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 12 }}>
        {items.map(item => {
          const active = item.match.includes(pathname);

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.85}
              onPress={() => {
                router.push(item.href);
                props.navigation.closeDrawer();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: active ? theme.card : 'transparent',
                marginBottom: 6,
              }}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? theme.accent : theme.secondaryText}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: active ? '700' : '500',
                  color: active ? theme.accent : theme.primaryText,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 14),
        }}
      >
        <Text
          style={{
            color: theme.secondaryText,
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 10,
          }}
        >
          {strings.drawer.preferences}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: theme.primaryText, fontSize: 14, fontWeight: '500' }}>
            {strings.drawer.theme}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 9999,
              overflow: 'hidden',
            }}
          >
            {([
              { key: 'light', label: strings.drawer.light },
              { key: 'dark', label: strings.drawer.dark },
            ] as const).map(option => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setMode(option.key)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  backgroundColor: mode === option.key ? theme.accent : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: mode === option.key ? theme.onAccent : theme.secondaryText,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            signOut();
            props.navigation.closeDrawer();
            router.replace('/login' as Href);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#C62828" />
          <Text style={{ color: '#C62828', fontSize: 14, fontWeight: '600' }}>
            {strings.drawer.signOut}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
