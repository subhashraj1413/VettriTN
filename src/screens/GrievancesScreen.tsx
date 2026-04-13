import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { TVKColors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PrimaryButton from '../components/PrimaryButton';
import { useAppLanguage } from '../i18n/LanguageProvider';

type GrievanceStatus = 'Filed' | 'Assigned' | 'Under Review' | 'Resolved';

interface Grievance {
  id:       string;
  title:    string;
  location: string;
  dept:     string;
  status:   GrievanceStatus;
  daysAgo:  string;
  progress: number;
}

const GRIEVANCES: Grievance[] = [
  {
    id:       'GR-2024-0892',
    title:    'Street light not working',
    location: 'Perambur Main Road, near Bus Stand',
    dept:     'Chennai Municipal Corporation',
    status:   'Under Review',
    daysAgo:  '2 days ago',
    progress: 65,
  },
  {
    id:       'GR-2024-0741',
    title:    'Road pothole near school',
    location: 'Gandhi Nagar, Perambur',
    dept:     'Highways Department',
    status:   'Resolved',
    daysAgo:  '5 days ago',
    progress: 100,
  },
];

const STATUS_STEPS: GrievanceStatus[] = ['Filed', 'Assigned', 'Under Review', 'Resolved'];

const statusBadgeVariant = (s: GrievanceStatus) => {
  switch (s) {
    case 'Resolved':     return 'success';
    case 'Under Review': return 'warning';
    case 'Assigned':     return 'info';
    default:             return 'neutral';
  }
};

const CATEGORIES = [
  'Roads & Infrastructure',
  'Electricity & Lighting',
  'Water Supply',
  'Sanitation & Waste',
  'Public Transport',
  'Government Service Delay',
  'Other',
];

const GrievancesScreen: React.FC = () => {
  const [activeTab,    setActiveTab]    = useState<'list' | 'new'>('list');
  const [category,     setCategory]     = useState(CATEGORIES[0]);
  const [description,  setDescription]  = useState('');
  const [location,     setLocation]     = useState('');
  const [priority,     setPriority]     = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [submitted,    setSubmitted]    = useState(false);
  const [submittedId,  setSubmittedId]  = useState('');
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();

  const handleSubmit = () => {
    if (!description.trim() || !location.trim()) {
      Alert.alert(strings.grievances.requiredTitle, strings.grievances.requiredMessage);
      return;
    }
    const newId = `GR-2024-${Math.floor(Math.random() * 900 + 100)}`;
    setSubmittedId(newId);
    setSubmitted(true);
  };

  const resetForm = () => {
    setDescription('');
    setLocation('');
    setPriority('Normal');
    setSubmitted(false);
    setActiveTab('list');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={TVKColors.primary} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTopRow}>
          <DrawerMenuButton />
          <Text style={styles.headerTitle}>{strings.grievances.title}</Text>
        </View>
        <View style={styles.tabs}>
          {(['list', 'new'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => { setActiveTab(tab); setSubmitted(false); }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'list' ? strings.grievances.myGrievances : strings.grievances.new}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'list' ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              [strings.grievances.total, '2'],
              [strings.grievances.open, '1'],
              [strings.grievances.resolved, '1'],
            ].map(([l, v]) => (
              <View key={l} style={styles.statCard}>
                <Text style={styles.statValue}>{v}</Text>
                <Text style={styles.statLabel}>{l}</Text>
              </View>
            ))}
          </View>

          {GRIEVANCES.map(g => (
            <Card key={g.id} style={styles.grievanceCard}>
              <View style={styles.grTopRow}>
                <Text style={styles.grId}>{g.id}</Text>
                <Badge label={g.status} variant={statusBadgeVariant(g.status) as any} />
              </View>

              <Text style={styles.grTitle}>{g.title}</Text>
              <Text style={styles.grLocation}>{g.location}</Text>

              <View style={styles.grMeta}>
                <Text style={styles.grDept}>{g.dept}</Text>
                <Text style={styles.grTime}>{g.daysAgo}</Text>
              </View>

              {/* Progress */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, {
                  width: `${g.progress}%` as any,
                  backgroundColor: g.status === 'Resolved' ? TVKColors.success : TVKColors.accent,
                }]} />
              </View>
              <View style={styles.stepsRow}>
                {STATUS_STEPS.map((step, i) => {
                  const stepIdx = STATUS_STEPS.indexOf(g.status);
                  const done    = i <= stepIdx;
                  return (
                    <Text key={step} style={[styles.stepLabel, done && styles.stepLabelDone]}>
                      {step}
                    </Text>
                  );
                })}
              </View>
            </Card>
          ))}
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      ) : submitted ? (
        /* ─── Success State ─────────────────────────────────────────── */
        <View style={styles.successScreen}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 36 }}>✅</Text>
          </View>
          <Text style={styles.successTitle}>{strings.grievances.filed}</Text>
          <Text style={styles.successSub}>{strings.grievances.filedSub}</Text>
          <View style={styles.successIdBox}>
            <Text style={styles.successIdLabel}>{strings.grievances.referenceId}</Text>
            <Text style={styles.successId}>{submittedId}</Text>
          </View>
          <Text style={styles.successEta}>{strings.grievances.eta}</Text>
          <PrimaryButton
            label={strings.grievances.viewMine}
            onPress={resetForm}
            style={{ marginTop: spacing.xl, width: 220 }}
          />
        </View>
      ) : (
        /* ─── New Grievance Form ────────────────────────────────────── */
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Card>
            <Text style={styles.formSection}>{strings.grievances.category}</Text>
            <View style={styles.categoryList}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.categoryChip, category === c && styles.categoryChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formSection}>{strings.grievances.description}</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder={strings.grievances.descriptionPlaceholder}
              placeholderTextColor={TVKColors.textTertiary}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.formSection}>{strings.grievances.location}</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder={strings.grievances.locationPlaceholder}
              placeholderTextColor={TVKColors.textTertiary}
            />

            <Text style={styles.formSection}>{strings.grievances.priority}</Text>
            <View style={styles.priorityRow}>
              {(['Normal', 'Urgent', 'Emergency'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityBtn, priority === p && styles.priorityBtnActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityBtnText, priority === p && styles.priorityBtnTextActive]}>
                    {p === 'Normal'
                      ? strings.grievances.normal
                      : p === 'Urgent'
                        ? strings.grievances.urgent
                        : strings.grievances.emergency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.attachRow}>
              <Text style={{ fontSize: 16 }}>📎</Text>
              <Text style={styles.attachText}>{strings.grievances.attachPhoto}</Text>
            </TouchableOpacity>

            <PrimaryButton
              label={strings.grievances.submit}
              onPress={handleSubmit}
              fullWidth
              style={{ marginTop: spacing.md }}
            />
          </Card>
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      )}
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
    paddingBottom:     spacing.lg,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  headerTitle: { ...typography.h4, color: TVKColors.white },
  tabs:        { flexDirection: 'row', gap: spacing.sm },
  tab:         {
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.xs,
    borderRadius:      radius.full,
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.4)',
  },
  tabActive:     { backgroundColor: TVKColors.white },
  tabText:       { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  tabTextActive: { color: TVKColors.primary, fontWeight: '600' },

  // Stats
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex:            1,
    backgroundColor: TVKColors.surface,
    borderRadius:    radius.md,
    padding:         spacing.md,
    alignItems:      'center',
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
  },
  statValue: { ...typography.h3, color: TVKColors.primary },
  statLabel: { ...typography.caption, color: TVKColors.textSecondary, marginTop: 2 },

  // Grievance card
  grievanceCard: { marginBottom: spacing.md },
  grTopRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  grId:          { ...typography.caption, color: TVKColors.textTertiary },
  grTitle:       { ...typography.h5, color: TVKColors.textPrimary, marginBottom: 4 },
  grLocation:    { ...typography.caption, color: TVKColors.textSecondary, marginBottom: spacing.sm },
  grMeta:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  grDept:        { ...typography.caption, color: TVKColors.textTertiary },
  grTime:        { ...typography.caption, color: TVKColors.textTertiary },

  progressTrack: { height: 5, backgroundColor: TVKColors.border, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.xs },
  progressFill:  { height: 5, borderRadius: 3 },
  stepsRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  stepLabel:     { ...typography.micro, color: TVKColors.textTertiary },
  stepLabelDone: { color: TVKColors.primary, fontWeight: '500' },

  // Success
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  successIcon:   {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: TVKColors.successLight,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    spacing.xl,
  },
  successTitle: { ...typography.h2, color: TVKColors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  successSub:   { ...typography.body2, color: TVKColors.textSecondary, textAlign: 'center', lineHeight: 24 },
  successIdBox: {
    backgroundColor: TVKColors.primaryLight,
    borderRadius:    radius.md,
    padding:         spacing.lg,
    alignItems:      'center',
    marginTop:       spacing.xl,
    width:           '100%',
  },
  successIdLabel: { ...typography.caption, color: TVKColors.textSecondary },
  successId:      { ...typography.h3, color: TVKColors.primary, marginTop: spacing.xs },
  successEta:     { ...typography.caption, color: TVKColors.textTertiary, marginTop: spacing.lg },

  // Form
  formSection: { ...typography.caption, color: TVKColors.textSecondary, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  textArea: {
    backgroundColor: TVKColors.background,
    borderRadius:    radius.md,
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
    padding:         spacing.md,
    ...typography.body2,
    color:           TVKColors.textPrimary,
    height:          100,
    textAlignVertical: 'top',
    marginBottom:    spacing.sm,
  },
  textInput: {
    backgroundColor: TVKColors.background,
    borderRadius:    radius.md,
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
    padding:         spacing.md,
    ...typography.body2,
    color:           TVKColors.textPrimary,
    marginBottom:    spacing.sm,
  },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
    borderRadius:      radius.full,
    borderWidth:       0.5,
    borderColor:       TVKColors.border,
    backgroundColor:   TVKColors.background,
  },
  categoryChipActive:     { backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  categoryChipText:       { ...typography.caption, color: TVKColors.textSecondary },
  categoryChipTextActive: { color: TVKColors.primary, fontWeight: '600' },
  priorityRow:            { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  priorityBtn: {
    flex:            1,
    padding:         spacing.sm,
    borderRadius:    radius.md,
    alignItems:      'center',
    borderWidth:     0.5,
    borderColor:     TVKColors.border,
    backgroundColor: TVKColors.surface,
  },
  priorityBtnActive:     { backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  priorityBtnText:       { ...typography.caption, color: TVKColors.textSecondary },
  priorityBtnTextActive: { color: TVKColors.primary, fontWeight: '600' },
  attachRow: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing.sm,
    backgroundColor: TVKColors.background,
    borderRadius:    radius.md,
    padding:         spacing.md,
    marginBottom:    spacing.sm,
  },
  attachText: { ...typography.body2, color: TVKColors.textSecondary },
});

export default GrievancesScreen;
