import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Href, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DrawerMenuButton from '../components/DrawerMenuButton';
import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';

const CITIZEN = {
  name: 'Subhash',
  initials: 'TS',
  id: 'TN-2024-087432',
  ward: 'Perambur, Chennai',
};

const HomeScreen: React.FC = () => {
  const openRoute = (href: Href) => router.push(href);
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme, mode } = useTheme();

  const ctaBg = mode === 'modern' ? theme.accent : TVKColors.primary;
  const ctaText = mode === 'modern' ? theme.onAccent : TVKColors.white;
  const ctaSubText = mode === 'modern' ? 'rgba(93,69,0,0.72)' : 'rgba(255,255,255,0.8)';
  const ctaChrome = mode === 'modern' ? 'rgba(93,69,0,0.12)' : 'rgba(255,255,255,0.14)';

  const elevatedCard = {
    shadowColor: TVKColors.redDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  } as const;

  const services = [
    {
      title: 'Bill Payments',
      subtitle: 'Electricity, water, tax and transport dues',
      href: '/payments' as Href,
      icon: 'wallet-outline' as const,
      iconColor: TVKColors.primary,
      tint: TVKColors.primaryLight,
    },
    {
      title: 'ID Management',
      subtitle: 'Citizen ID, linked records and verification',
      href: '/citizen-id' as Href,
      icon: 'card-outline' as const,
      iconColor: TVKColors.accentDark,
      tint: TVKColors.accentLight,
    },
    {
      title: 'Public Complaints',
      subtitle: 'Raise civic issues and track resolution',
      href: '/grievances' as Href,
      icon: 'alert-circle-outline' as const,
      iconColor: TVKColors.maroon,
      tint: TVKColors.redLight,
    },
    {
      title: 'Announcements',
      subtitle: 'Government notices and service updates',
      href: '/schemes' as Href,
      icon: 'megaphone-outline' as const,
      iconColor: TVKColors.redDark,
      tint: TVKColors.yellowLight,
    },
  ] as const;

  const metrics = [
    { label: 'Bills Due', value: '2', tone: TVKColors.primary, href: '/payments' as Href },
    { label: 'IDs Linked', value: '4', tone: TVKColors.maroon, href: '/citizen-id' as Href },
    { label: 'Open Cases', value: '1', tone: TVKColors.accentDark, href: '/grievances' as Href },
  ] as const;

  const announcements = [
    {
      title: 'Property Tax Window Open',
      subtitle: 'Pay before 30 Apr to avoid late fee penalties.',
      tag: 'Finance',
    },
    {
      title: 'Digital ID Verification Drive',
      subtitle: 'Ward help centers available from 9:30 AM to 5:30 PM.',
      tag: 'Identity',
    },
    {
      title: 'Road Repair Complaint Camp',
      subtitle: 'Priority ticketing for unresolved road safety issues.',
      tag: 'Civic Works',
    },
  ] as const;

  const sectionTitleStyle = {
    color: TVKColors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 26,
  } as const;

  return (
    <View className="flex-1" style={{ backgroundColor: TVKColors.background }}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="overflow-hidden rounded-b-[34px] px-5 pb-8"
          style={{ backgroundColor: theme.headerBackground, paddingTop: insets.top + 12 }}
        >
          <View
            className="absolute -left-12 -top-10 h-40 w-40 rounded-full"
            style={{ backgroundColor: TVKColors.maroon, opacity: 0.4 }}
          />
          <View
            className="absolute -right-16 top-8 h-52 w-52 rounded-full"
            style={{ backgroundColor: TVKColors.yellow, opacity: 0.2 }}
          />

          <View className="flex-row items-center justify-between">
            <DrawerMenuButton color={theme.headerText} backgroundColor={theme.headerChrome} />
            <TouchableOpacity
              className="h-11 w-11 items-center justify-center rounded-full"
              onPress={() => openRoute('/profile' as Href)}
              activeOpacity={0.85}
              style={{ backgroundColor: theme.headerChrome }}
            >
              <Text className="text-[13px] font-bold" style={{ color: theme.headerText }}>
                {CITIZEN.initials}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5">
            <Text
              className="text-[11px] font-semibold uppercase tracking-[2px]"
              style={{ color: theme.headerSubText }}
            >
              {strings.home.badge}
            </Text>
            <Text
              className="mt-2 text-[30px] font-semibold leading-[36px]"
              style={{ color: theme.headerText }}
            >
              {strings.home.greeting}, {CITIZEN.name.split(' ')[0]}
            </Text>
            <Text
              className="mt-2 text-[14px] leading-[20px]"
              style={{ color: theme.headerSubText }}
            >
              One trusted place for payments, IDs, civic complaints, and official updates.
            </Text>
          </View>

          <View className="mt-5 flex-row">
            <View
              className="mr-3 rounded-full border px-3 py-1"
              style={{
                borderColor: theme.headerSubText,
                backgroundColor: theme.headerChrome,
              }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: theme.headerText }}>
                Verified Account
              </Text>
            </View>
            <View
              className="rounded-full border px-3 py-1"
              style={{
                borderColor: theme.headerSubText,
                backgroundColor: theme.headerChrome,
              }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: theme.headerText }}>
                Accessibility Enabled
              </Text>
            </View>
          </View>
        </View>

        <View className="-mt-5 px-4">
          <View
            className="overflow-hidden rounded-[22px] border bg-white px-4 pb-4 pt-4"
            style={[elevatedCard, { borderColor: TVKColors.border }]}
          >
            <View
              className="absolute -right-10 -top-9 h-36 w-36 rounded-full"
              style={{ backgroundColor: TVKColors.primaryLight }}
            />
            <View
              className="absolute -left-10 bottom-0 h-28 w-28 rounded-full"
              style={{ backgroundColor: TVKColors.accentLight }}
            />

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[12px] font-semibold uppercase tracking-[1px]" style={{ color: TVKColors.primaryDark }}>
                  Next Due
                </Text>
                <Text className="mt-1 text-[24px] font-bold" style={{ color: TVKColors.textPrimary }}>
                  INR 150.40
                </Text>
                <Text className="mt-1 text-[13px] leading-[18px]" style={{ color: TVKColors.textSecondary }}>
                  Electricity bill due on 28 Apr for Ward {CITIZEN.ward}.
                </Text>
              </View>
              <TouchableOpacity
                className="rounded-[14px] px-3 py-3"
                onPress={() => openRoute('/payments' as Href)}
                activeOpacity={0.9}
                style={{ backgroundColor: ctaBg }}
              >
                <Ionicons name="arrow-forward" size={20} color={ctaText} />
                <Text className="mt-1 text-[12px] font-semibold" style={{ color: ctaText }}>
                  Pay Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-5">
            <Text style={sectionTitleStyle}>Services</Text>
            <Text className="mt-1 text-[13px]" style={{ color: TVKColors.textSecondary }}>
              Everyday governance tasks with clear navigation.
            </Text>

            <View className="mt-3 flex-row flex-wrap justify-between">
              {services.map(service => (
                <TouchableOpacity
                  key={service.title}
                  className="mb-3 w-[48%] rounded-[18px] border bg-white px-4 py-4"
                  style={[elevatedCard, { borderColor: TVKColors.border }]}
                  onPress={() => openRoute(service.href)}
                  activeOpacity={0.9}
                >
                  <View
                    className="h-11 w-11 items-center justify-center rounded-[13px]"
                    style={{ backgroundColor: service.tint }}
                  >
                    <Ionicons name={service.icon} size={22} color={service.iconColor} />
                  </View>
                  <Text className="mt-3 text-[15px] font-semibold" style={{ color: TVKColors.textPrimary }}>
                    {service.title}
                  </Text>
                  <Text className="mt-1 text-[12px] leading-[17px]" style={{ color: TVKColors.textSecondary }}>
                    {service.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            className="mt-2 rounded-[20px] border px-4 py-4"
            style={{ borderColor: `${TVKColors.accentDark}40`, backgroundColor: TVKColors.yellowLight }}
          >
            <View className="flex-row items-center justify-between">
              <Text style={sectionTitleStyle}>Account Snapshot</Text>
              <TouchableOpacity onPress={() => openRoute('/documents' as Href)} activeOpacity={0.8}>
                <Text className="text-[12px] font-semibold" style={{ color: TVKColors.primary }}>
                  View Records
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex-row gap-2">
              {metrics.map(metric => (
                <TouchableOpacity
                  key={metric.label}
                  className="flex-1 rounded-[14px] border px-2 py-3"
                  style={{ borderColor: TVKColors.border, backgroundColor: TVKColors.white }}
                  onPress={() => openRoute(metric.href)}
                  activeOpacity={0.88}
                >
                  <Text className="text-center text-[21px] font-bold" style={{ color: metric.tone }}>
                    {metric.value}
                  </Text>
                  <Text className="mt-1 text-center text-[11px] font-medium" style={{ color: TVKColors.textSecondary }}>
                    {metric.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            className="mt-4 rounded-[20px] border px-4 py-4"
            style={{ borderColor: TVKColors.border, backgroundColor: TVKColors.white }}
          >
            <View className="flex-row items-center justify-between">
              <Text style={sectionTitleStyle}>Public Announcements</Text>
              <TouchableOpacity onPress={() => openRoute('/schemes' as Href)} activeOpacity={0.85}>
                <Ionicons name="chevron-forward" size={18} color={TVKColors.primary} />
              </TouchableOpacity>
            </View>

            {announcements.map(item => (
              <TouchableOpacity
                key={item.title}
                className="mt-3 flex-row rounded-[14px] border px-3 py-3"
                style={{ borderColor: TVKColors.borderLight, backgroundColor: TVKColors.surfaceAlt }}
                onPress={() => openRoute('/schemes' as Href)}
                activeOpacity={0.9}
              >
                <View
                  className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: TVKColors.primaryLight }}
                >
                  <Ionicons name="notifications-outline" size={16} color={TVKColors.primary} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 pr-2 text-[14px] font-semibold" style={{ color: TVKColors.textPrimary }}>
                      {item.title}
                    </Text>
                    <View className="rounded-full px-2 py-1" style={{ backgroundColor: TVKColors.accentLight }}>
                      <Text className="text-[10px] font-semibold" style={{ color: TVKColors.accentDark }}>
                        {item.tag}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-1 text-[12px] leading-[17px]" style={{ color: TVKColors.textSecondary }}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="mt-4 flex-row items-center rounded-[18px] px-4 py-4"
            onPress={() => openRoute('/chat' as Href)}
            activeOpacity={0.9}
            style={{ backgroundColor: ctaBg }}
          >
            <View
              className="mr-3 h-11 w-11 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: ctaChrome }}
            >
              <MaterialCommunityIcons name="shield-check-outline" size={22} color={ctaText} />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-semibold" style={{ color: ctaText }}>
                Need Assistance?
              </Text>
              <Text className="mt-1 text-[12px] leading-[17px]" style={{ color: ctaSubText }}>
                Ask Vettri AI for guided steps in English or Tamil.
              </Text>
            </View>
            <Ionicons name="sparkles-outline" size={18} color={ctaText} />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4">
          <View
            className="rounded-[16px] border px-4 py-3"
            style={{ borderColor: TVKColors.border, backgroundColor: TVKColors.white }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold" style={{ color: TVKColors.textPrimary }}>
                Citizen ID
              </Text>
              <Text className="text-[11px] font-medium" style={{ color: TVKColors.primary }}>
                {CITIZEN.id}
              </Text>
            </View>
            <Text className="mt-1 text-[12px] leading-[16px]" style={{ color: TVKColors.textSecondary }}>
              Secure, unified identity with trusted service access and transparent updates.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
