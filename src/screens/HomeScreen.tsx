import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Href, router } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DrawerMenuButton from '../components/DrawerMenuButton';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';

const CITIZEN = {
  name: 'Rajesh Kumar',
  initials: 'RK',
  id: 'TN-2024-087432',
  constituency: 'Perambur',
  district: 'Chennai',
};

const HomeScreen: React.FC = () => {
  const openRoute = (href: Href) => router.push(href);
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const quickActions = [
    {
      label: strings.home.quickActions.documentsLabel,
      sub: strings.home.quickActions.documentsSub,
      href: '/documents' as Href,
      icon: 'document-text-outline',
      tint: '#FFE8EC',
      iconColor: TVKColors.primary,
    },
    {
      label: strings.home.quickActions.servicesLabel,
      sub: strings.home.quickActions.servicesSub,
      href: '/services' as Href,
      icon: 'grid-outline',
      tint: '#FFF8E1',
      iconColor: TVKColors.accentDark,
    },
    {
      label: strings.home.quickActions.complaintsLabel,
      sub: strings.home.quickActions.complaintsSub,
      href: '/grievances' as Href,
      icon: 'alert-circle-outline',
      tint: '#FFEBEE',
      iconColor: TVKColors.error,
    },
    {
      label: strings.home.quickActions.schemesLabel,
      sub: strings.home.quickActions.schemesSub,
      href: '/schemes' as Href,
      icon: 'ribbon-outline',
      tint: '#EDE7F6',
      iconColor: TVKColors.purple,
    },
  ] as const;
  const heroStats = [
    { label: strings.home.activeSchemes, value: '3', href: '/schemes' as Href, tone: 'gold' },
    { label: strings.home.openIssues, value: '1', href: '/grievances' as Href, tone: 'rose' },
    { label: strings.home.docsReady, value: '6', href: '/documents' as Href, tone: 'ivory' },
  ] as const;
  const recentActivity = [
    {
      title: strings.home.activity.incomeTitle,
      sub: strings.home.activity.incomeSub,
      time: strings.home.activity.today,
      icon: 'document-lock-outline',
      color: TVKColors.warning,
    },
    {
      title: strings.home.activity.grievanceTitle,
      sub: strings.home.activity.grievanceSub,
      time: strings.home.activity.yesterday,
      icon: 'flash-outline',
      color: TVKColors.info,
    },
    {
      title: strings.home.activity.schemeTitle,
      sub: strings.home.activity.schemeSub,
      time: strings.home.activity.daysAgo,
      icon: 'wallet-outline',
      color: TVKColors.success,
    },
  ] as const;

  return (
    <View className="flex-1 bg-tvk-paper">
      <StatusBar barStyle="light-content" backgroundColor={TVKColors.primary} />

      <View className="bg-tvk-red">
        <View className="flex-row">
          <View className="h-1 flex-1 bg-tvk-maroon" />
          <View className="h-1 flex-1 bg-tvk-gold" />
          <View className="h-1 flex-1 bg-tvk-maroon" />
        </View>

        <View
          className="flex-row items-center justify-between px-5 pb-5"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-1 flex-row items-center">
            <View className="mr-3">
              <DrawerMenuButton />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-white/70">
                {strings.home.badge}
              </Text>
              <Text className="mt-1 text-[24px] font-bold leading-[30px] text-white">
                {strings.home.greeting}, {CITIZEN.name.split(' ')[0]}
              </Text>
              <Text className="mt-1 text-[13px] leading-[18px] text-white/75">
                {strings.home.subtitle}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="ml-4 h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15"
            onPress={() => openRoute('/profile' as Href)}
            activeOpacity={0.85}
          >
            <Text className="text-sm font-bold text-white">{CITIZEN.initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="-mt-6 overflow-hidden rounded-panel border border-tvk-border bg-white shadow-card">
          <View className="bg-tvk-mist px-5 py-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-tvk-red/75">
                  {strings.home.verifiedCitizenId}
                </Text>
                <Text className="mt-2 text-[26px] font-bold leading-[32px] text-tvk-ink">
                  {CITIZEN.name}
                </Text>
                <Text className="mt-1 text-[14px] font-medium text-tvk-muted">
                  {CITIZEN.id}
                </Text>
                <Text className="mt-3 text-[14px] leading-[20px] text-tvk-muted">
                  {CITIZEN.district} district, {CITIZEN.constituency} constituency
                </Text>
              </View>

              <View className="rounded-panel bg-tvk-gold px-3 py-2">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-tvk-amber">
                  {strings.home.live}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3 px-4 py-4">
            {heroStats.map(stat => (
              <TouchableOpacity
                key={stat.label}
                className={`flex-1 rounded-panel px-3 py-3 ${
                  stat.tone === 'gold'
                    ? 'bg-tvk-cream'
                    : stat.tone === 'rose'
                      ? 'bg-tvk-blush'
                      : 'bg-tvk-paper'
                }`}
                onPress={() => openRoute(stat.href)}
                activeOpacity={0.85}
              >
                <Text className="text-center text-[22px] font-bold text-tvk-ink">{stat.value}</Text>
                <Text className="mt-1 text-center text-[11px] font-medium text-tvk-muted">
                  {stat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="mx-4 mb-4 flex-row items-center rounded-panel bg-tvk-maroon px-4 py-4"
            onPress={() => openRoute('/citizen-id' as Href)}
            activeOpacity={0.88}
          >
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-panel bg-white/12">
              <Ionicons name="card-outline" size={20} color={TVKColors.yellow} />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-semibold text-white">
                {strings.home.openCitizenId}
              </Text>
              <Text className="mt-1 text-[12px] leading-[16px] text-white/70">
                {strings.home.citizenIdSub}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={TVKColors.yellow} />
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-tvk-ink">{strings.home.quickAccess}</Text>
            <Text className="text-[12px] font-medium text-tvk-red">
              {strings.home.digitalServices}
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {quickActions.map(a => (
              <TouchableOpacity
                key={a.label}
                className="mb-3 w-[48%] rounded-panel border border-tvk-border bg-white p-4 shadow-soft"
                onPress={() => openRoute(a.href)}
                activeOpacity={0.88}
              >
                <View
                  className="mb-4 h-11 w-11 items-center justify-center rounded-panel"
                  style={{ backgroundColor: a.tint }}
                >
                  <Ionicons name={a.icon} size={20} color={a.iconColor} />
                </View>
                <Text className="text-[15px] font-semibold text-tvk-ink">{a.label}</Text>
                <Text className="mt-1 text-[12px] leading-[16px] text-tvk-muted">{a.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          className="mt-2 flex-row items-center rounded-panel bg-tvk-red px-4 py-4 shadow-card"
          onPress={() => openRoute('/chat' as Href)}
          activeOpacity={0.9}
        >
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-panel bg-white/14">
            <MaterialCommunityIcons name="robot-excited-outline" size={22} color={TVKColors.yellow} />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-semibold text-white">{strings.home.askAi}</Text>
            <Text className="mt-1 text-[13px] leading-[18px] text-white/72">
              {strings.home.askAiSub}
            </Text>
          </View>
          <Ionicons name="sparkles-outline" size={18} color={TVKColors.yellow} />
        </TouchableOpacity>

        <View className="mb-3 mt-6 flex-row items-center justify-between">
          <Text className="text-[18px] font-bold text-tvk-ink">{strings.home.recentActivity}</Text>
          <TouchableOpacity onPress={() => openRoute('/documents' as Href)} activeOpacity={0.8}>
            <Text className="text-[12px] font-medium text-tvk-red">{strings.home.viewAll}</Text>
          </TouchableOpacity>
        </View>

        {recentActivity.map((a, i) => (
          <View key={i} className="mb-3 flex-row rounded-panel border border-tvk-border bg-white p-4 shadow-soft">
            <View
              className="mr-3 h-11 w-11 items-center justify-center rounded-panel"
              style={{ backgroundColor: `${a.color}18` }}
            >
              <Ionicons name={a.icon} size={19} color={a.color} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-start justify-between">
                <Text className="mr-3 flex-1 text-[15px] font-semibold text-tvk-ink">
                  {a.title}
                </Text>
                <Text className="text-[11px] font-medium text-tvk-muted">{a.time}</Text>
              </View>
              <Text className="mt-1 text-[13px] leading-[18px] text-tvk-muted">{a.sub}</Text>
            </View>
          </View>
        ))}

        <View className="mt-3 rounded-panel border border-tvk-border bg-tvk-cream p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] font-semibold text-tvk-amber">
                {strings.home.focusTitle}
              </Text>
              <Text className="mt-1 text-[13px] leading-[18px] text-tvk-muted">
                {strings.home.focusSub}
              </Text>
            </View>
            <Feather name="sunrise" size={20} color={TVKColors.accentDark} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
