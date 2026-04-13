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
import { TVKColors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useAppLanguage } from '../i18n/LanguageProvider';

interface Document {
  id:         string;
  name:       string;
  type:       string;
  updatedOn:  string;
  status:     'Verified' | 'Available' | 'Pending' | 'Due' | 'Request';
  badgeVariant: 'success' | 'info' | 'warning' | 'error' | 'neutral';
  emoji:      string;
}

const DOCUMENTS: Document[] = [
  { id: 'D1', name: 'Aadhaar Card',          type: 'Identity',  updatedOn: 'Jan 2024',  status: 'Verified',  badgeVariant: 'success', emoji: '🪪' },
  { id: 'D2', name: 'Voter ID Card',          type: 'Identity',  updatedOn: 'Mar 2021',  status: 'Verified',  badgeVariant: 'success', emoji: '🗳️' },
  { id: 'D3', name: 'PAN Card',               type: 'Financial', updatedOn: 'Linked',    status: 'Verified',  badgeVariant: 'success', emoji: '💳' },
  { id: 'D4', name: 'Birth Certificate',       type: 'Civil',     updatedOn: 'Issued 1988', status: 'Available', badgeVariant: 'info', emoji: '📋' },
  { id: 'D5', name: 'Community Certificate',  type: 'Social',    updatedOn: 'Issued 2020', status: 'Available', badgeVariant: 'info', emoji: '📜' },
  { id: 'D6', name: 'Ration Card',            type: 'Welfare',   updatedOn: 'Updated 2023', status: 'Verified', badgeVariant: 'success', emoji: '🏷️' },
  { id: 'D7', name: 'Income Certificate',     type: 'Financial', updatedOn: 'Applied Today', status: 'Pending', badgeVariant: 'warning', emoji: '📄' },
  { id: 'D8', name: 'Land Tax Receipt',        type: 'Property',  updatedOn: 'Due Mar 2026', status: 'Due',    badgeVariant: 'error', emoji: '🏘️' },
  { id: 'D9', name: 'Nativity Certificate',   type: 'Civil',     updatedOn: 'Not applied', status: 'Request', badgeVariant: 'neutral', emoji: '📝' },
];

const DocumentsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const filters = [
    { value: 'All', label: strings.documents.filters.all },
    { value: 'Identity', label: strings.documents.filters.identity },
    { value: 'Civil', label: strings.documents.filters.civil },
    { value: 'Financial', label: strings.documents.filters.financial },
    { value: 'Welfare', label: strings.documents.filters.welfare },
    { value: 'Property', label: strings.documents.filters.property },
  ];

  const filtered = DOCUMENTS.filter(d =>
    activeFilter === 'All' || d.type === activeFilter,
  );

  const canDownload  = (d: Document) => d.status === 'Available' || d.status === 'Verified';
  const canRequest   = (d: Document) => d.status === 'Request';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={TVKColors.primary} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTopRow}>
          <DrawerMenuButton />
          <Text style={styles.headerTitle}>{strings.documents.title}</Text>
        </View>
        <View style={styles.headerStats}>
          {[
            ['6', strings.documents.verified],
            ['2', strings.documents.available],
            ['1', strings.documents.pending],
          ].map(([v, l]) => (
            <View key={l} style={styles.headerStat}>
              <Text style={styles.headerStatValue}>{v}</Text>
              <Text style={styles.headerStatLabel}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ─── Filter Chips ────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === f.value && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── Request New Banner ──────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.requestBanner} activeOpacity={0.8}>
          <Text style={styles.requestBannerText}>+ {strings.documents.requestNew}</Text>
          <Text style={styles.requestBannerChev}>›</Text>
        </TouchableOpacity>

        {filtered.map(doc => (
          <Card key={doc.id} style={styles.docCard}>
            <View style={styles.docRow}>
              <View style={styles.docIconWrap}>
                <Text style={{ fontSize: 22 }}>{doc.emoji}</Text>
              </View>

              <View style={styles.docInfo}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docMeta}>{doc.type} · {doc.updatedOn}</Text>
              </View>

              <View style={styles.docActions}>
                <Badge label={doc.status} variant={doc.badgeVariant} />
                {canDownload(doc) && (
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => Alert.alert('Document Viewer', `Opening ${doc.name}...`)}
                  >
                    <Text style={styles.viewBtnText}>{strings.documents.actions.view}</Text>
                  </TouchableOpacity>
                )}
                {canRequest(doc) && (
                  <TouchableOpacity
                    style={styles.reqBtn}
                    onPress={() => Alert.alert('Apply', `Starting application for ${doc.name}...`)}
                  >
                    <Text style={styles.reqBtnText}>{strings.documents.actions.apply}</Text>
                  </TouchableOpacity>
                )}
                {doc.status === 'Due' && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => Alert.alert('Payment', `Redirecting to payment for ${doc.name}...`)}
                  >
                    <Text style={styles.payBtnText}>{strings.documents.actions.payNow}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        ))}

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
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  headerTitle: { ...typography.h4, color: TVKColors.white },
  headerStats: { flexDirection: 'row', gap: spacing.lg },
  headerStat:  {},
  headerStatValue: { ...typography.h3, color: TVKColors.white },
  headerStatLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  filterScroll:  { maxHeight: 48, backgroundColor: TVKColors.surface, borderBottomWidth: 0.5, borderBottomColor: TVKColors.border },
  filterContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
    borderRadius:      radius.full,
    backgroundColor:   TVKColors.background,
    borderWidth:       0.5,
    borderColor:       TVKColors.border,
  },
  filterChipActive:     { backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  filterChipText:       { ...typography.caption, color: TVKColors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: TVKColors.primary, fontWeight: '600' },

  requestBanner: {
    backgroundColor:  TVKColors.primaryLight,
    borderRadius:     radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    marginBottom:     spacing.md,
    borderWidth:      0.5,
    borderColor:      `${TVKColors.primary}30`,
  },
  requestBannerText: { ...typography.h5, color: TVKColors.primaryDark },
  requestBannerChev: { fontSize: 20, color: TVKColors.primary },

  docCard: { marginBottom: spacing.sm },
  docRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docIconWrap: {
    width:           44,
    height:          44,
    borderRadius:    radius.md,
    backgroundColor: TVKColors.background,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  docInfo:    { flex: 1 },
  docName:    { ...typography.h5, color: TVKColors.textPrimary },
  docMeta:    { ...typography.caption, color: TVKColors.textSecondary, marginTop: 2 },
  docActions: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  viewBtn:    { marginTop: 4 },
  viewBtnText: { ...typography.caption, color: TVKColors.info, fontWeight: '500' },
  reqBtn:     { marginTop: 4 },
  reqBtnText: { ...typography.caption, color: TVKColors.purple, fontWeight: '500' },
  payBtn:     { marginTop: 4 },
  payBtnText: { ...typography.caption, color: TVKColors.error, fontWeight: '500' },
});

export default DocumentsScreen;
