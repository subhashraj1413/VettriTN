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
import SectionTitle from '../components/SectionTitle';
import ActivityItem from '../components/ActivityItem';
import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';

const CITIZEN = {
  name: 'Subhash',
  initials: 'TS',
  id: 'TN-2024-087432',
  constituency: 'Perambur',
  district: 'Chennai',
};

const HomeScreen: React.FC = () => {
  const openRoute = (href: Href) => router.push(href);
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const classicPanelStyle = {
    borderColor: '#D8E0EA',
    borderWidth: 1,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  } as const;
  const softPanelStyle = {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  } as const;
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
  const statToneColors = {
    gold: '#C9A000',
    rose: '#C41E3A',
    ivory: '#475569',
  } as const;
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
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      <View className="rounded-b-[10px]" style={{ backgroundColor: theme.headerBackground }}>
        <View className="flex-row">
          <View className="h-1 flex-1" style={{ backgroundColor: theme.headerText }} />
          <View className="h-1 flex-1" style={{ backgroundColor: TVKColors.primary }} />
          <View className="h-1 flex-1" style={{ backgroundColor: theme.headerText }} />
        </View>

        <View
          className="flex-row items-center justify-between px-5 pb-5"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-1 flex-row items-center">
            <View className="mr-3">
              <DrawerMenuButton
                color={theme.headerText}
                backgroundColor={theme.headerChrome}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: theme.headerSubText }}
              >
                {strings.home.badge}
              </Text>
              <Text
                className="mt-1 text-[24px] font-bold leading-[30px]"
                style={{ color: theme.headerText }}
              >
                {strings.home.greeting}, {CITIZEN.name.split(' ')[0]}
              </Text>
              <Text
                className="mt-1 text-[13px] leading-[18px]"
                style={{ color: theme.headerSubText }}
              >
                {strings.home.subtitle}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="ml-4 h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15"
            onPress={() => openRoute('/profile' as Href)}
            activeOpacity={0.85}
            style={{
              borderColor: theme.headerChrome,
              backgroundColor: theme.headerChrome,
            }}
          >
            <Text className="text-sm font-bold" style={{ color: theme.headerText }}>
              {CITIZEN.initials}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-5 overflow-hidden rounded-panel bg-white" style={classicPanelStyle}>
          <View className="bg-white px-5 py-4" style={{ borderBottomWidth: 1, borderBottomColor: '#E6EDF5' }}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-tvk-red/70">
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

              <View
                className="rounded-panel px-3 py-2"
                style={{ backgroundColor: '#F7E8AA', borderWidth: 1, borderColor: '#E9D488' }}
              >
                <Text className="text-[11px] font-bold uppercase tracking-[0.6px] text-tvk-amber">
                  {strings.home.live}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3 px-4 py-4">
            {heroStats.map(stat => (
              <TouchableOpacity
                key={stat.label}
                className="flex-1 rounded-panel bg-white px-3 py-3"
                style={{
                  borderWidth: 1,
                  borderColor: '#DDE4EC',
                  borderTopWidth: 3,
                  borderTopColor: statToneColors[stat.tone],
                }}
                onPress={() => openRoute(stat.href)}
                activeOpacity={0.85}
              >
                <Text
                  className="text-center text-[22px] font-bold"
                  style={{ color: statToneColors[stat.tone] }}
                >
                  {stat.value}
                </Text>
                <Text className="mt-1 text-center text-[11px] font-medium text-tvk-muted">
                  {stat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="mx-4 mb-4 flex-row items-center rounded-panel px-4 py-4"
            style={{ backgroundColor: '#801226', borderWidth: 1, borderColor: '#680C1F' }}
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
          <SectionTitle
            title={strings.home.quickAccess}
            action={strings.home.digitalServices}
          />

          <View className="flex-row flex-wrap justify-between">
            {quickActions.map(a => (
              <TouchableOpacity
                key={a.label}
                className="mb-3 w-[48%] rounded-panel border bg-white px-4 pb-4 pt-3"
                style={[softPanelStyle, { borderColor: '#DDE4EC' }]}
                onPress={() => openRoute(a.href)}
                activeOpacity={0.88}
              >
                <View
                  className="mb-3 h-1 w-9 rounded-full"
                  style={{ backgroundColor: a.iconColor }}
                />
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
          className="mt-3 flex-row items-center rounded-panel px-4 py-4"
          style={[
            classicPanelStyle,
            {
              backgroundColor: TVKColors.primary,
              borderColor: '#9A1B31',
            },
          ]}
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

        <SectionTitle
          title={strings.home.recentActivity}
          action={strings.home.viewAll}
          onAction={() => openRoute('/documents' as Href)}
          className="mt-6"
        />

        {recentActivity.map((a, i) => (
          <ActivityItem
            key={i}
            title={a.title}
            subtitle={a.sub}
            time={a.time}
            icon={a.icon}
            color={a.color}
          />
        ))}

        <View
          className="mt-3 rounded-panel border bg-white p-4"
          style={[softPanelStyle, { borderColor: '#DDE4EC' }]}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] font-semibold text-tvk-red">
                {strings.home.focusTitle}
              </Text>
              <Text className="mt-1 text-[13px] leading-[18px] text-tvk-muted">
                {strings.home.focusSub}
              </Text>
            </View>
            <Feather name="sunrise" size={20} color={TVKColors.primary} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
