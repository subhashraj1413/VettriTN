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
import ChipGroup, { ChipOption } from '../components/ChipGroup';
import FormField from '../components/FormField';
import EmptyState from '../components/EmptyState';
import { TVKColors } from '../theme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { useTheme } from '../hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

type GrievanceStatus = 'Filed' | 'Assigned' | 'Under Review' | 'Resolved';
type Priority        = 'Normal' | 'Urgent' | 'Emergency';

interface Grievance {
  id:       string;
  title:    string;
  location: string;
  dept:     string;
  status:   GrievanceStatus;
  daysAgo:  string;
  progress: number;
}

// ─── Static data ─────────────────────────────────────────────────────────────

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

const CATEGORIES = [
  'Roads & Infrastructure',
  'Electricity & Lighting',
  'Water Supply',
  'Sanitation & Waste',
  'Public Transport',
  'Government Service Delay',
  'Other',
];

const PRIORITY_OPTIONS: ChipOption<Priority>[] = [
  { value: 'Normal',    label: 'Normal' },
  { value: 'Urgent',    label: 'Urgent' },
  { value: 'Emergency', label: 'Emergency' },
];

const statusBadgeVariant = (s: GrievanceStatus) => {
  switch (s) {
    case 'Resolved':     return 'success' as const;
    case 'Under Review': return 'warning' as const;
    case 'Assigned':     return 'info' as const;
    default:             return 'neutral' as const;
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

const GrievancesScreen: React.FC = () => {
  const [activeTab,   setActiveTab]   = useState<'list' | 'new'>('list');
  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [location,    setLocation]    = useState('');
  const [priority,    setPriority]    = useState<Priority>('Normal');
  const [submitted,   setSubmitted]   = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const { strings } = useAppLanguage();
  const { theme } = useTheme();

  const handleSubmit = () => {
    if (!description.trim() || !location.trim()) {
      Alert.alert(strings.grievances.requiredTitle, strings.grievances.requiredMessage);
      return;
    }
    setSubmittedId(`GR-2024-${Math.floor(Math.random() * 900 + 100)}`);
    setSubmitted(true);
  };

  const resetForm = () => {
    setDescription('');
    setLocation('');
    setPriority('Normal');
    setSubmitted(false);
    setActiveTab('list');
  };

  // ── Tab pills rendered in the ScreenHeader bottom slot ─────────────────
  const tabSlot = (
    <View className="flex-row gap-2">
      {(['list', 'new'] as const).map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => { setActiveTab(tab); setSubmitted(false); }}
          className="px-5 py-1.5 rounded-full border"
          style={{
            backgroundColor: activeTab === tab ? theme.headerChrome : 'transparent',
            borderColor: theme.headerSubText,
          }}
        >
          <Text
            className="text-[13px]"
            style={{
              fontWeight: activeTab === tab ? '600' : '500',
              color: activeTab === tab ? theme.headerText : theme.headerSubText,
            }}
          >
            {tab === 'list' ? strings.grievances.myGrievances : strings.grievances.new}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader title={strings.grievances.title} bottom={tabSlot} />

      {/* ── LIST TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'list' && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Stats row */}
          <View className="flex-row gap-3 mb-4">
            {[
              [strings.grievances.total, '2'],
              [strings.grievances.open, '1'],
              [strings.grievances.resolved, '1'],
            ].map(([label, value]) => (
              <View
                key={label}
                className="flex-1 bg-tvk-surface rounded-panel items-center py-3 border border-tvk-border"
              >
                <Text className="text-[20px] font-bold text-tvk-primary">{value}</Text>
                <Text className="text-[11px] text-tvk-text-secondary mt-0.5">{label}</Text>
              </View>
            ))}
          </View>

          {/* Grievance cards */}
          {GRIEVANCES.map(g => (
            <Card key={g.id}>
              {/* Top row */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[11px] text-tvk-text-tertiary">{g.id}</Text>
                <Badge label={g.status} variant={statusBadgeVariant(g.status)} />
              </View>

              <Text className="text-[15px] font-semibold text-tvk-text-primary mb-1">{g.title}</Text>
              <Text className="text-[12px] text-tvk-text-secondary mb-3">{g.location}</Text>

              <View className="flex-row justify-between mb-3">
                <Text className="text-[11px] text-tvk-text-tertiary">{g.dept}</Text>
                <Text className="text-[11px] text-tvk-text-tertiary">{g.daysAgo}</Text>
              </View>

              {/* Progress bar */}
              <View className="h-1.5 bg-tvk-border rounded-full overflow-hidden mb-2">
                <View
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${g.progress}%`,
                    backgroundColor: g.status === 'Resolved' ? TVKColors.success : TVKColors.accent,
                  }}
                />
              </View>

              {/* Step labels */}
              <View className="flex-row justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= STATUS_STEPS.indexOf(g.status);
                  return (
                    <Text
                      key={step}
                      className={`text-[10px] font-medium ${done ? 'text-tvk-primary' : 'text-tvk-text-tertiary'}`}
                    >
                      {step}
                    </Text>
                  );
                })}
              </View>
            </Card>
          ))}

          <View className="h-6" />
        </ScrollView>
      )}

      {/* ── NEW GRIEVANCE / SUCCESS ──────────────────────────────────────── */}
      {activeTab === 'new' && (
        submitted ? (
          /* Success state */
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-20 h-20 rounded-full bg-tvk-success-light items-center justify-center mb-6">
              <Text className="text-4xl">✅</Text>
            </View>
            <Text className="text-[22px] font-bold text-tvk-text-primary mb-2 text-center">
              {strings.grievances.filed}
            </Text>
            <Text className="text-[14px] text-tvk-text-secondary text-center leading-6 mb-6">
              {strings.grievances.filedSub}
            </Text>
            <View className="bg-tvk-primary-light rounded-panel p-5 items-center w-full mb-4">
              <Text className="text-[12px] text-tvk-text-secondary">{strings.grievances.referenceId}</Text>
              <Text className="text-[20px] font-bold text-tvk-primary mt-1">{submittedId}</Text>
            </View>
            <Text className="text-[12px] text-tvk-text-tertiary mb-8">{strings.grievances.eta}</Text>
            <PrimaryButton
              label={strings.grievances.viewMine}
              onPress={resetForm}
              className="w-56"
            />
          </View>
        ) : (
          /* New grievance form */
          <ScrollView
            className="flex-1"
            contentContainerClassName="p-4"
            showsVerticalScrollIndicator={false}
          >
            <Card>
              {/* Category */}
              <ChipGroup
                label={strings.grievances.category}
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
                value={category}
                onChange={setCategory}
                wrap
                className="mb-2"
              />

              {/* Description */}
              <FormField
                label={strings.grievances.description}
                value={description}
                onChangeText={setDescription}
                placeholder={strings.grievances.descriptionPlaceholder}
                multiline
                numberOfLines={4}
                required
                helperText="Include landmark, issue duration, and current impact."
              />

              {/* Location */}
              <FormField
                label={strings.grievances.location}
                value={location}
                onChangeText={setLocation}
                placeholder={strings.grievances.locationPlaceholder}
                required
                helperText="Street name or nearest public building."
              />

              {/* Priority */}
              <ChipGroup
                label={strings.grievances.priority}
                options={PRIORITY_OPTIONS.map(p => ({
                  value: p.value,
                  label: p.value === 'Normal'
                    ? strings.grievances.normal
                    : p.value === 'Urgent'
                      ? strings.grievances.urgent
                      : strings.grievances.emergency,
                }))}
                value={priority}
                onChange={p => setPriority(p as Priority)}
                className="mb-4"
              />

              {/* Photo attach */}
              <TouchableOpacity className="flex-row items-center gap-3 bg-tvk-background rounded-panel p-3 mb-3">
                <Text className="text-base">📎</Text>
                <Text className="text-[14px] text-tvk-text-secondary">{strings.grievances.attachPhoto}</Text>
              </TouchableOpacity>

              <PrimaryButton
                label={strings.grievances.submit}
                onPress={handleSubmit}
                fullWidth
              />
            </Card>
            <View className="h-6" />
          </ScrollView>
        )
      )}
    </View>
  );
};

export default GrievancesScreen;
