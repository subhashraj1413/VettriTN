import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { useTheme } from '../hooks/useTheme';
import { TVKColors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PrimaryButton from '../components/PrimaryButton';
import { useAppLanguage } from '../i18n/LanguageProvider';

interface Scheme {
  id:        string;
  name:      string;
  desc:      string;
  amount:    string;
  dept:      string;
  eligible:  boolean;
  enrolled:  boolean;
  color:     string;
  bgColor:   string;
  emoji:     string;
}

const SCHEMES: Scheme[] = [
  {
    id: 'S1', name: 'Magalir Urimai Thittam',
    desc: 'Monthly financial assistance for women heads of household',
    amount: '₹1,000/month', dept: 'Social Welfare Dept',
    eligible: true, enrolled: true,
    color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '👩',
  },
  {
    id: 'S2', name: 'Chief Minister Free Bus Travel',
    desc: 'Free travel on all TNSTC/MTC buses for eligible citizens',
    amount: 'Free travel', dept: 'Transport Dept',
    eligible: true, enrolled: true,
    color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🚌',
  },
  {
    id: 'S3', name: 'Free LPG Cylinder Scheme',
    desc: '4 free LPG cylinders per year for BPL families',
    amount: '4 cylinders/year', dept: 'Food & Civil Supplies',
    eligible: true, enrolled: false,
    color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🔥',
  },
  {
    id: 'S4', name: 'Vettri TN Housing Scheme',
    desc: 'Affordable housing subsidy for low-income families',
    amount: '₹2.5L subsidy', dept: 'Housing Board',
    eligible: false, enrolled: false,
    color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '🏠',
  },
  {
    id: 'S5', name: 'Student Merit Scholarship',
    desc: 'Annual scholarship for students scoring 75%+ from low-income families',
    amount: '₹5,000/year', dept: 'School Education Dept',
    eligible: false, enrolled: false,
    color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🎓',
  },
  {
    id: 'S6', name: 'Fishermen Safety Scheme',
    desc: 'Annual safety assistance for registered fishermen',
    amount: '₹20,000/year', dept: 'Fisheries Dept',
    eligible: false, enrolled: false,
    color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🎣',
  },
];

const SchemesScreen: React.FC = () => {
  const [enrolledIds, setEnrolledIds] = useState<string[]>(['S1', 'S2']);
  const [filter, setFilter]           = useState<'all' | 'enrolled' | 'eligible'>('all');
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { mode, theme } = useTheme();

  const filteredSchemes = SCHEMES.filter(s => {
    if (filter === 'enrolled') return enrolledIds.includes(s.id);
    if (filter === 'eligible') return s.eligible && !enrolledIds.includes(s.id);
    return true;
  });

  const enrolledCount  = enrolledIds.length;
  const eligibleCount  = SCHEMES.filter(s => s.eligible && !enrolledIds.includes(s.id)).length;
  const monthlyBenefit = '₹1,000';

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

  return (
    <View style={styles.root}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm, backgroundColor: theme.headerBackground },
        ]}
      >
        <View style={styles.headerTopRow}>
          <DrawerMenuButton
            color={theme.headerText}
            backgroundColor={theme.headerChrome}
          />
          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerTitle, { color: theme.headerText }]}>
              {strings.schemes.title}
            </Text>
            <Text style={[styles.headerSub, { color: theme.headerSubText }]}>
              {strings.schemes.subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            {
              label: strings.schemes.enrolled,
              value: String(enrolledCount),
              bg: mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
              color: mode === 'dark' ? theme.headerText : TVKColors.white,
            },
            {
              label: strings.schemes.newEligible,
              value: String(eligibleCount),
              bg: mode === 'dark' ? 'rgba(255,255,255,0.3)' : TVKColors.accentLight,
              color: mode === 'dark' ? theme.headerText : TVKColors.accentDark,
            },
            {
              label: strings.schemes.monthly,
              value: monthlyBenefit,
              bg: mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
              color: mode === 'dark' ? theme.headerText : TVKColors.white,
            },
          ].map(s => (
            <View key={s.label} style={[styles.statChip, { backgroundColor: s.bg }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: s.color, opacity: 0.8 }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ─── Filter Tabs ─────────────────────────────────────────────── */}
      <View style={styles.filterRow}>
        {(['all', 'enrolled', 'eligible'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f === 'all'
                ? strings.schemes.allSchemes
                : f === 'enrolled'
                  ? strings.schemes.enrolled
                  : strings.schemes.newEligible}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredSchemes.map(scheme => {
          const isEnrolled = enrolledIds.includes(scheme.id);
          return (
            <Card key={scheme.id} style={styles.schemeCard}>
              <View style={styles.schemeTop}>
                <View style={[styles.schemeIconWrap, { backgroundColor: scheme.bgColor }]}>
                  <Text style={{ fontSize: 22 }}>{scheme.emoji}</Text>
                </View>
                <View style={styles.schemeMeta}>
                  <Text style={styles.schemeName}>{scheme.name}</Text>
                  <Text style={styles.schemeDept}>{scheme.dept}</Text>
                </View>
              </View>

              <Text style={styles.schemeDesc}>{scheme.desc}</Text>

              <View style={styles.schemeBottom}>
                <Text style={[styles.schemeAmount, { color: scheme.color }]}>{scheme.amount}</Text>
                {isEnrolled ? (
                  <Badge label={strings.schemes.enrolled} variant="success" />
                ) : scheme.eligible ? (
                  <Badge label={strings.schemes.eligible} variant="warning" />
                ) : (
                  <Badge label={strings.schemes.notEligible} variant="neutral" />
                )}
              </View>

              {!isEnrolled && scheme.eligible && (
                <PrimaryButton
                  label={strings.schemes.enrollNow}
                  onPress={() => handleEnroll(scheme)}
                  variant="outline"
                  color={scheme.color}
                  fullWidth
                  style={{ marginTop: spacing.md }}
                />
              )}
            </Card>
          );
        })}

        {filteredSchemes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32, marginBottom: spacing.md }}>🔍</Text>
            <Text style={styles.emptyText}>{strings.schemes.empty}</Text>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: TVKColors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg },

  header: {
    backgroundColor:   TVKColors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.xl,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  headerTextWrap: { flex: 1 },
  headerTitle: { ...typography.h4, color: TVKColors.white },
  headerSub:   { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsRow:    { flexDirection: 'row', gap: spacing.sm },
  statChip: {
    flex:            1,
    borderRadius:    radius.md,
    padding:         spacing.sm,
    alignItems:      'center',
  },
  statValue: { ...typography.h4 },
  statLabel: { ...typography.micro, marginTop: 2 },

  filterRow: {
    flexDirection:     'row',
    gap:               spacing.sm,
    padding:           spacing.md,
    backgroundColor:   TVKColors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: TVKColors.border,
  },
  filterBtn:         { flex: 1, paddingVertical: spacing.xs, borderRadius: radius.full, alignItems: 'center', backgroundColor: TVKColors.background },
  filterBtnActive:   { backgroundColor: TVKColors.primaryLight },
  filterBtnText:     { ...typography.caption, color: TVKColors.textSecondary },
  filterBtnTextActive: { color: TVKColors.primary, fontWeight: '600' },

  schemeCard: { marginBottom: spacing.md },
  schemeTop:  { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  schemeIconWrap: {
    width:           48,
    height:          48,
    borderRadius:    radius.md,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  schemeMeta:   { flex: 1 },
  schemeName:   { ...typography.h5, color: TVKColors.textPrimary },
  schemeDept:   { ...typography.caption, color: TVKColors.textSecondary, marginTop: 2 },
  schemeDesc:   { ...typography.body2, color: TVKColors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  schemeBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schemeAmount: { ...typography.h5 },

  emptyState: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyText:  { ...typography.body2, color: TVKColors.textTertiary },
});

export default SchemesScreen;
