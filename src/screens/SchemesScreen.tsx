import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import FilterBar, { FilterOption } from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { TVKColors } from '../theme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { useTheme } from '../hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scheme {
  id:       string;
  name:     string;
  desc:     string;
  amount:   string;
  dept:     string;
  eligible: boolean;
  color:    string;
  bgColor:  string;
  emoji:    string;
}

type SchemeFilter = 'all' | 'enrolled' | 'eligible';

// ─── Static data ─────────────────────────────────────────────────────────────

const SCHEMES: Scheme[] = [
  {
    id: 'S1', name: 'Magalir Urimai Thittam',
    desc: 'Monthly financial assistance for women heads of household',
    amount: '₹1,000/month', dept: 'Social Welfare Dept',
    eligible: true, color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '👩',
  },
  {
    id: 'S2', name: 'Chief Minister Free Bus Travel',
    desc: 'Free travel on all TNSTC/MTC buses for eligible citizens',
    amount: 'Free travel', dept: 'Transport Dept',
    eligible: true, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🚌',
  },
  {
    id: 'S3', name: 'Free LPG Cylinder Scheme',
    desc: '4 free LPG cylinders per year for BPL families',
    amount: '4 cylinders/year', dept: 'Food & Civil Supplies',
    eligible: true, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🔥',
  },
  {
    id: 'S4', name: 'Vettri TN Housing Scheme',
    desc: 'Affordable housing subsidy for low-income families',
    amount: '₹2.5L subsidy', dept: 'Housing Board',
    eligible: false, color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '🏠',
  },
  {
    id: 'S5', name: 'Student Merit Scholarship',
    desc: 'Annual scholarship for students scoring 75%+ from low-income families',
    amount: '₹5,000/year', dept: 'School Education Dept',
    eligible: false, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🎓',
  },
  {
    id: 'S6', name: 'Fishermen Safety Scheme',
    desc: 'Annual safety assistance for registered fishermen',
    amount: '₹20,000/year', dept: 'Fisheries Dept',
    eligible: false, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🎣',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const SchemesScreen: React.FC = () => {
  const [enrolledIds, setEnrolledIds] = useState<string[]>(['S1', 'S2']);
  const [filter,      setFilter]      = useState<SchemeFilter>('all');
  const { strings } = useAppLanguage();
  const { mode, theme } = useTheme();

  const enrolledCount  = enrolledIds.length;
  const eligibleCount  = SCHEMES.filter(s => s.eligible && !enrolledIds.includes(s.id)).length;

  const filteredSchemes = SCHEMES.filter(s => {
    if (filter === 'enrolled') return enrolledIds.includes(s.id);
    if (filter === 'eligible') return s.eligible && !enrolledIds.includes(s.id);
    return true;
  });

  const handleEnroll = (scheme: Scheme) => {
    Alert.alert(
      strings.schemes.confirmTitle,
      `Enroll in "${scheme.name}"?\n\nYou will receive ${scheme.amount}.`,
      [
        { text: strings.schemes.cancel, style: 'cancel' },
        {
          text: strings.schemes.enrollAction,
          onPress: () => {
            setEnrolledIds(prev => [...prev, scheme.id]);
            Alert.alert(
              strings.schemes.successTitle,
              `${strings.schemes.successMessage} ${scheme.name}. ${strings.schemes.successTail}`,
            );
          },
        },
      ],
    );
  };

  // ── Header stats ─────────────────────────────────────────────────────────
  const headerStats = [
    {
      label:      strings.schemes.enrolled,
      value:      String(enrolledCount),
      bgColor:    mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
      valueColor: theme.headerText,
    },
    {
      label:      strings.schemes.newEligible,
      value:      String(eligibleCount),
      bgColor:    mode === 'dark' ? 'rgba(255,255,255,0.3)' : TVKColors.accentLight,
      valueColor: mode === 'dark' ? theme.headerText : TVKColors.accentDark,
    },
    {
      label:      strings.schemes.monthly,
      value:      '₹1,000',
      bgColor:    mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
      valueColor: theme.headerText,
    },
  ];

  // ── Filter options ───────────────────────────────────────────────────────
  const filterOptions: FilterOption<SchemeFilter>[] = [
    { value: 'all',      label: strings.schemes.allSchemes },
    { value: 'enrolled', label: strings.schemes.enrolled },
    { value: 'eligible', label: strings.schemes.newEligible },
  ];

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader
        title={strings.schemes.title}
        subtitle={strings.schemes.subtitle}
        stats={headerStats}
      />

      {/* Filter bar */}
      <FilterBar
        options={filterOptions}
        value={filter}
        onChange={setFilter}
        fullWidth
        className="mx-4 mt-3 mb-1"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredSchemes.map(scheme => {
          const isEnrolled = enrolledIds.includes(scheme.id);
          return (
            <Card key={scheme.id}>
              {/* Top row — icon + meta */}
              <View className="flex-row items-start gap-3 mb-2">
                <View
                  className="w-12 h-12 rounded-panel items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: scheme.bgColor }}
                >
                  <Text className="text-[22px]">{scheme.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-tvk-text-primary">{scheme.name}</Text>
                  <Text className="text-[12px] text-tvk-text-secondary mt-0.5">{scheme.dept}</Text>
                </View>
              </View>

              {/* Description */}
              <Text className="text-[13px] text-tvk-text-secondary leading-5 mb-4">
                {scheme.desc}
              </Text>

              {/* Amount + badge */}
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] font-semibold" style={{ color: scheme.color }}>
                  {scheme.amount}
                </Text>
                {isEnrolled ? (
                  <Badge label={strings.schemes.enrolled} variant="success" />
                ) : scheme.eligible ? (
                  <Badge label={strings.schemes.eligible} variant="warning" />
                ) : (
                  <Badge label={strings.schemes.notEligible} variant="neutral" />
                )}
              </View>

              {/* Enroll button */}
              {!isEnrolled && scheme.eligible && (
                <PrimaryButton
                  label={strings.schemes.enrollNow}
                  onPress={() => handleEnroll(scheme)}
                  variant="outline"
                  color={scheme.color}
                  fullWidth
                  className="mt-4"
                />
              )}
            </Card>
          );
        })}

        {filteredSchemes.length === 0 && (
          <EmptyState message={strings.schemes.empty} />
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

export default SchemesScreen;
