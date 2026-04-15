import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Card from '../components/Card';
import Badge, { BadgeVariant } from '../components/Badge';
import ScreenHeader from '../components/ScreenHeader';
import FilterBar, { FilterOption } from '../components/FilterBar';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';

// ─── Cert routing ────────────────────────────────────────────────────────────

const CERT_ID_MAP: Record<string, string> = {
  'Birth Certificate':     'birth',
  'Nativity Certificate':  'nativity',
  'Income Certificate':    'income',
  'Community Certificate': 'community',
};

const navigateToRequest = (docName?: string) => {
  const typeId = docName ? CERT_ID_MAP[docName] : undefined;
  router.push(
    typeId
      ? `/(protected)/request-certificate?typeId=${typeId}`
      : '/(protected)/request-certificate',
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = 'Verified' | 'Available' | 'Pending' | 'Due' | 'Request';

interface Document {
  id:           string;
  name:         string;
  type:         string;
  updatedOn:    string;
  status:       DocStatus;
  badgeVariant: BadgeVariant;
  emoji:        string;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const DOCUMENTS: Document[] = [
  { id: 'D1', name: 'Aadhaar Card',         type: 'Identity',  updatedOn: 'Jan 2024',       status: 'Verified',  badgeVariant: 'success', emoji: '🪪' },
  { id: 'D2', name: 'Voter ID Card',         type: 'Identity',  updatedOn: 'Mar 2021',       status: 'Verified',  badgeVariant: 'success', emoji: '🗳️' },
  { id: 'D3', name: 'PAN Card',              type: 'Financial', updatedOn: 'Linked',         status: 'Verified',  badgeVariant: 'success', emoji: '💳' },
  { id: 'D4', name: 'Birth Certificate',      type: 'Civil',     updatedOn: 'Issued 1988',   status: 'Available', badgeVariant: 'info',    emoji: '📋' },
  { id: 'D5', name: 'Community Certificate', type: 'Social',    updatedOn: 'Issued 2020',   status: 'Available', badgeVariant: 'info',    emoji: '📜' },
  { id: 'D6', name: 'Ration Card',           type: 'Welfare',   updatedOn: 'Updated 2023',  status: 'Verified',  badgeVariant: 'success', emoji: '🏷️' },
  { id: 'D7', name: 'Income Certificate',    type: 'Financial', updatedOn: 'Applied Today', status: 'Pending',   badgeVariant: 'warning', emoji: '📄' },
  { id: 'D8', name: 'Land Tax Receipt',       type: 'Property',  updatedOn: 'Due Mar 2026',  status: 'Due',       badgeVariant: 'error',   emoji: '🏘️' },
  { id: 'D9', name: 'Nativity Certificate',  type: 'Civil',     updatedOn: 'Not applied',   status: 'Request',   badgeVariant: 'neutral', emoji: '📝' },
];

type DocFilter = 'All' | 'Identity' | 'Civil' | 'Financial' | 'Welfare' | 'Property';

// ─── Component ───────────────────────────────────────────────────────────────

const DocumentsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<DocFilter>('All');
  const { strings } = useAppLanguage();

  const filters: FilterOption<DocFilter>[] = [
    { value: 'All',       label: strings.documents.filters.all },
    { value: 'Identity',  label: strings.documents.filters.identity },
    { value: 'Civil',     label: strings.documents.filters.civil },
    { value: 'Financial', label: strings.documents.filters.financial },
    { value: 'Welfare',   label: strings.documents.filters.welfare },
    { value: 'Property',  label: strings.documents.filters.property },
  ];

  const filtered = DOCUMENTS.filter(d =>
    activeFilter === 'All' || d.type === activeFilter,
  );

  const canDownload = (d: Document) => d.status === 'Available' || d.status === 'Verified';
  const canRequest  = (d: Document) => d.status === 'Request';

  // ── Header stats ─────────────────────────────────────────────────────────
  const headerStats = [
    { label: strings.documents.verified,  value: '6' },
    { label: strings.documents.available, value: '2' },
    { label: strings.documents.pending,   value: '1' },
  ];

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader title={strings.documents.title} stats={headerStats} />

      {/* Horizontal filter chips */}
      <FilterBar
        options={filters}
        value={activeFilter}
        onChange={setActiveFilter}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Request new banner */}
        <TouchableOpacity
          className="flex-row items-center justify-between bg-tvk-primary-light rounded-panel px-4 py-3 mb-4 border border-tvk-primary/20"
          activeOpacity={0.8}
          onPress={() => navigateToRequest()}
        >
          <Text className="text-[15px] font-semibold text-tvk-primary-dark">
            + {strings.documents.requestNew}
          </Text>
          <Text className="text-[20px]" style={{ color: TVKColors.primary }}>›</Text>
        </TouchableOpacity>

        {/* Document cards */}
        {filtered.map(doc => (
          <Card key={doc.id} className="mb-2">
            <View className="flex-row items-center gap-3">
              {/* Emoji icon */}
              <View className="w-11 h-11 rounded-panel bg-tvk-background items-center justify-center flex-shrink-0">
                <Text className="text-[22px]">{doc.emoji}</Text>
              </View>

              {/* Info */}
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-tvk-text-primary">{doc.name}</Text>
                <Text className="text-[12px] text-tvk-text-secondary mt-0.5">
                  {doc.type} · {doc.updatedOn}
                </Text>
              </View>

              {/* Actions */}
              <View className="items-end gap-1.5 flex-shrink-0">
                <Badge label={doc.status} variant={doc.badgeVariant} />
                {canDownload(doc) && (
                  <TouchableOpacity
                    className="mt-1"
                    onPress={() => Alert.alert('Document Viewer', `Opening ${doc.name}...`)}
                  >
                    <Text className="text-[12px] font-medium text-tvk-info">
                      {strings.documents.actions.view}
                    </Text>
                  </TouchableOpacity>
                )}
                {canRequest(doc) && (
                  <TouchableOpacity
                    className="mt-1"
                    onPress={() => navigateToRequest(doc.name)}
                  >
                    <Text className="text-[12px] font-medium text-tvk-purple">
                      {strings.documents.actions.apply}
                    </Text>
                  </TouchableOpacity>
                )}
                {doc.status === 'Due' && (
                  <TouchableOpacity
                    className="mt-1"
                    onPress={() => Alert.alert('Payment', `Redirecting to payment for ${doc.name}...`)}
                  >
                    <Text className="text-[12px] font-medium text-tvk-error">
                      {strings.documents.actions.payNow}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        ))}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

export default DocumentsScreen;
