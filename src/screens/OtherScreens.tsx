// ─── CitizenIDScreen ─────────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import DrawerMenuButton from '../components/DrawerMenuButton';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useTheme } from '../hooks/useTheme';
import { TVKColors } from '../theme';
import { useAppLanguage } from '../i18n/LanguageProvider';

// ─── CitizenIDScreen ──────────────────────────────────────────────────────────

export const CitizenIDScreen: React.FC = () => {
  const { strings } = useAppLanguage();

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader title={strings.citizenId.title} leftAction="auto" />

      <ScrollView contentContainerClassName="p-4">
        {/* ── Front ID card ───────────────────────────────────────────── */}
        <View
          className="rounded-[18px] p-5 mb-4"
          style={{ backgroundColor: TVKColors.primary }}
        >
          {/* Top row */}
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-[10px] font-medium tracking-[0.8px] text-white/65 uppercase">
                GOVERNMENT OF TAMIL NADU
              </Text>
              <Text className="text-[12px] text-white/85 mt-0.5">Vettri TN Citizen ID</Text>
            </View>
            <View className="bg-white/15 rounded-md px-2 py-0.5">
              <Text className="text-[10px] font-medium tracking-[0.5px] text-white/90 uppercase">
                VERIFIED
              </Text>
            </View>
          </View>

          {/* Citizen row */}
          <View className="flex-row gap-3 items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/35">
              <Text className="text-[22px] font-bold text-white">TS</Text>
            </View>
            <View>
              <Text className="text-[16px] font-semibold text-white">Subhash</Text>
              <Text className="text-[12px] text-white/70 mt-0.5">S/O Thangaraj</Text>
              <Text className="text-[12px] text-white/70 mt-0.5">DOB: 14 May 1989</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-white/20 mb-4" />

          {/* Detail grid */}
          <View className="flex-row flex-wrap gap-3">
            {[
              ['Citizen ID',    'TN-2024-087432'],
              ['Constituency',  'Aranthangi'],
              ['District',      'Pudukkottai'],
              ['Valid Until',   'Dec 2029'],
            ].map(([key, val]) => (
              <View key={key} className="w-[45%]">
                <Text className="text-[10px] text-white/60 uppercase tracking-[0.5px]">{key}</Text>
                <Text className="text-[14px] font-medium text-white mt-0.5">{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── QR Code ─────────────────────────────────────────────────── */}
        <Card className="items-center">
          <Text className="text-[12px] font-medium text-tvk-text-secondary mb-4">
            {strings.citizenId.scanToVerify}
          </Text>
          <View className="w-[120px] h-[120px] items-center justify-center">
            <Image
              source={require('../assets/qr-placeholder.png')}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <Text className="text-[12px] text-tvk-text-tertiary mt-2">
            TN-2024-087432 · Valid for 24 hours
          </Text>
          <TouchableOpacity
            className="mt-4 px-5 py-1.5 rounded-full border border-tvk-border"
            onPress={() => Alert.alert(
              strings.citizenId.qrRefreshed,
              strings.citizenId.qrRefreshedMessage,
            )}
          >
            <Text className="text-[12px] text-tvk-primary">🔄 {strings.citizenId.refreshQr}</Text>
          </TouchableOpacity>
        </Card>

        {/* ── Linked documents ────────────────────────────────────────── */}
        <Card>
          <Text className="text-[14px] font-semibold text-tvk-text-primary mb-4">
            {strings.citizenId.linkedDocuments}
          </Text>
          {([
            ['Aadhaar Card', '**** **** 4821', 'success' as const],
            ['Voter ID',     'TN/19/0234/...',  'success' as const],
            ['PAN Card',     'ABCPK****F',       'info'    as const],
          ] as const).map(([name, num, variant]) => (
            <View
              key={name}
              className="flex-row justify-between items-center py-2 border-b border-tvk-border"
            >
              <View>
                <Text className="text-[14px] text-tvk-text-primary">{name}</Text>
                <Text className="text-[12px] text-tvk-text-secondary mt-0.5">{num}</Text>
              </View>
              <Badge label="Linked" variant={variant} />
            </View>
          ))}
        </Card>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

// ─── ServicesScreen ───────────────────────────────────────────────────────────

export const ServicesScreen: React.FC = () => {
  const { strings } = useAppLanguage();

  const categories = [
    { emoji: '📋', label: 'Certificates', color: TVKColors.primary,    bg: TVKColors.primaryLight  },
    { emoji: '🏠', label: 'Housing',      color: TVKColors.info,       bg: TVKColors.infoLight     },
    { emoji: '💊', label: 'Health',       color: TVKColors.success,    bg: TVKColors.successLight  },
    { emoji: '🚌', label: 'Transport',    color: TVKColors.purple,     bg: TVKColors.purpleLight   },
    { emoji: '🎓', label: 'Education',    color: TVKColors.accentDark, bg: TVKColors.accentLight   },
    { emoji: '💡', label: 'Utilities',    color: TVKColors.error,      bg: TVKColors.errorLight    },
  ];

  const recentRequests = [
    { title: 'Income Certificate', cat: 'Certificates', status: 'Under Review', date: 'Today',       emoji: '📋', statusColor: TVKColors.warning },
    { title: 'Property Tax',       cat: 'Utilities',    status: 'Completed',    date: '1 week ago',  emoji: '💡', statusColor: TVKColors.success },
  ];

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader
        title={strings.services.title}
        subtitle={strings.services.subtitle}
        leftAction="auto"
      />

      <ScrollView contentContainerClassName="p-4">
        {/* Category grid */}
        <Text className="text-[14px] font-semibold text-tvk-text-secondary mb-3 mt-1">
          {strings.services.selectCategory}
        </Text>
        <View className="flex-row flex-wrap gap-4 mb-6">
          {categories.map(c => (
            <TouchableOpacity
              key={c.label}
              className="w-[47%] p-5 rounded-[14px] items-center gap-2 border border-black/5"
              style={{ backgroundColor: c.bg }}
              onPress={() => Alert.alert(c.label, `Starting ${c.label} service request...`)}
              activeOpacity={0.8}
            >
              <Text className="text-[28px]">{c.emoji}</Text>
              <Text className="text-[14px] font-semibold text-center" style={{ color: c.color }}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent requests */}
        <Text className="text-[14px] font-semibold text-tvk-text-secondary mb-3">
          {strings.services.recentRequests}
        </Text>
        {recentRequests.map((r, i) => (
          <Card key={i} className="flex-row items-center gap-3 mb-2">
            <Text className="text-2xl">{r.emoji}</Text>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-tvk-text-primary">{r.title}</Text>
              <Text className="text-[12px] text-tvk-text-secondary mt-0.5">
                {r.cat} · {r.date}
              </Text>
            </View>
            <Text className="text-[12px] font-semibold" style={{ color: r.statusColor }}>
              {r.status}
            </Text>
          </Card>
        ))}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

// ─── ProfileScreen ────────────────────────────────────────────────────────────

export const ProfileScreen: React.FC = () => {
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: strings.profile.personalInformation,
      rows: [
        ['Full Name',      'Subhash'],
        ['Date of Birth',  '14 May 1989'],
        ['Gender',         'Male'],
        ['Mobile',         '+91 98*** ***21'],
        ['Email',          'tksubhashraj14@gmail.com'],
      ],
    },
    {
      title: strings.profile.address,
      rows: [
        ['Street',   '12A, Gandhi Nagar'],
        ['Area',     'Mimisal, Aranthangi'],
        ['District', 'Pudukkottai'],
        ['PIN Code', '614621'],
      ],
    },
    {
      title: strings.profile.civicInformation,
      rows: [
        ['Constituency', 'Perambur'],
        ['Voter ID',     'TN/19/0234/...'],
        ['Ward',         'Ward 72, Zone 3'],
        ['Ration Card',  'Linked & Verified'],
      ],
    },
  ];

  return (
    <View className="flex-1 bg-tvk-background">
      {/* ── Profile header ────────────────────────────────────────────── */}
      <View
        className="items-center pb-8"
        style={{
          backgroundColor: theme.headerBackground,
          paddingTop: insets.top + 20,
        }}
      >
        {/* Drawer button — top-left */}
        <View className="w-full px-4 mb-4 items-start">
          <DrawerMenuButton
            color={theme.headerText}
            backgroundColor={theme.headerChrome}
            action="auto"
          />
        </View>

        {/* Avatar */}
        <View
          className="w-[76px] h-[76px] rounded-full items-center justify-center border-[3px] mb-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderColor: TVKColors.yellow,
          }}
        >
          <Text className="text-[22px] font-bold text-white">RK</Text>
        </View>

        <Text className="text-[20px] font-bold" style={{ color: theme.headerText }}>
          Subhash
        </Text>
        <Text className="text-[12px] mt-1" style={{ color: theme.headerSubText }}>
          TN-2024-087432 · {strings.profile.verifiedCitizen}
        </Text>

        {/* TVK flag strip */}
        <View className="flex-row w-[60px] h-1.5 rounded-full overflow-hidden mt-3">
          {[TVKColors.maroon, TVKColors.yellow, TVKColors.maroon].map((c, i) => (
            <View key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4">
        {sections.map(s => (
          <Card key={s.title} className="mb-4">
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-tvk-text-secondary mb-2">
              {s.title}
            </Text>
            {s.rows.map(([key, val]) => (
              <View
                key={key}
                className="flex-row justify-between py-2 border-b border-tvk-border"
              >
                <Text className="text-[14px] text-tvk-text-secondary">{key}</Text>
                <Text className="text-[14px] font-medium text-tvk-text-primary">{val}</Text>
              </View>
            ))}
          </Card>
        ))}

        {/* Sign out */}
        <TouchableOpacity
          className="border border-tvk-error rounded-panel p-3 items-center mb-4"
          onPress={() => Alert.alert(strings.profile.signOut, 'Are you sure?')}
        >
          <Text className="text-[14px] font-semibold text-tvk-error">
            {strings.profile.signOut}
          </Text>
        </TouchableOpacity>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};
