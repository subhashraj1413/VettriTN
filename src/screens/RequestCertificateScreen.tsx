/**
 * RequestCertificateScreen
 * ─────────────────────────────────────────────────────────────────────────────
 * 4-step wizard for requesting a new government certificate:
 *   Step 1 – Select certificate type (searchable catalogue)
 *   Step 2 – Applicant details (pre-filled from session, dynamic extra fields)
 *   Step 3 – Upload required documents (simulated picker)
 *   Step 4 – Review & submit
 *   ✓      – Success screen with reference number
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors, typography, spacing, radius } from '../theme';
import { CERTIFICATE_TYPES } from '../services/certificateService';
import { useCertificates } from '../features/certificates/hooks/useCertificates';
import type { CertificateType } from '../features/certificates/types';
import Card from '../components/Card';
import type { AppStrings } from '../i18n/translations';

// ─── Constants ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const TN_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
  'Thanjavur', 'Ranipet', 'Sivagangai', 'Virudhunagar', 'Nagapattinam',
  'Kancheepuram', 'Villupuram', 'Cuddalore', 'Namakkal', 'Nilgiris',
  'Tiruppur', 'Kallakurichi', 'Chengalpattu', 'Tenkasi', 'Ramanathapuram',
  'Pudukkottai', 'Perambalur', 'Ariyalur', 'Karur', 'Tiruvannamalai',
  'Dharmapuri', 'Krishnagiri', 'Theni', 'Tirupattur', 'Mayiladuthurai',
];

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Top progress stepper */
const StepIndicator: React.FC<{
  currentStep: number;
  labels: string[];
}> = ({ currentStep, labels }) => (
  <View style={si.container}>
    {labels.map((label, i) => {
      const step      = i + 1;
      const done      = step < currentStep;
      const active    = step === currentStep;
      return (
        <React.Fragment key={step}>
          <View style={si.item}>
            <View style={[
              si.circle,
              done   && si.circleDone,
              active && si.circleActive,
            ]}>
              {done
                ? <Ionicons name="checkmark" size={12} color={TVKColors.white} />
                : <Text style={[si.circleText, active && si.circleTextActive]}>{step}</Text>
              }
            </View>
            <Text style={[si.label, active && si.labelActive]} numberOfLines={1}>
              {label}
            </Text>
          </View>
          {i < labels.length - 1 && (
            <View style={[si.line, done && si.lineDone]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const si = StyleSheet.create({
  container:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  item:            { alignItems: 'center', width: 60 },
  circle:          { width: 24, height: 24, borderRadius: 12, backgroundColor: TVKColors.border, alignItems: 'center', justifyContent: 'center' },
  circleDone:      { backgroundColor: TVKColors.success },
  circleActive:    { backgroundColor: TVKColors.primary },
  circleText:      { ...typography.micro, color: TVKColors.textSecondary, fontWeight: '700' },
  circleTextActive:{ color: TVKColors.white },
  label:           { ...typography.micro, color: TVKColors.textSecondary, marginTop: 4, textAlign: 'center' },
  labelActive:     { color: TVKColors.primary, fontWeight: '600' },
  line:            { flex: 1, height: 1.5, backgroundColor: TVKColors.border, marginBottom: 18 },
  lineDone:        { backgroundColor: TVKColors.success },
});

/** Labelled text input */
const FormField: React.FC<{
  label:        string;
  value:        string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?:   number;
}> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', maxLength }) => (
  <View style={ff.wrap}>
    <Text style={ff.label}>{label}</Text>
    <TextInput
      style={ff.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? label.replace(' *', '')}
      placeholderTextColor={TVKColors.textTertiary}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
  </View>
);

const ff = StyleSheet.create({
  wrap:  { marginBottom: spacing.md },
  label: { ...typography.caption, color: TVKColors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: TVKColors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    ...typography.body2, color: TVKColors.textPrimary, backgroundColor: TVKColors.surface,
  },
});

/** Gender picker */
const GenderPicker: React.FC<{
  value:    string;
  onChange: (v: string) => void;
  strings:  { male: string; female: string; other: string };
}> = ({ value, onChange, strings }) => (
  <View style={gp.row}>
    {[
      { k: 'Male',   l: strings.male },
      { k: 'Female', l: strings.female },
      { k: 'Other',  l: strings.other },
    ].map(({ k, l }) => (
      <TouchableOpacity
        key={k}
        style={[gp.chip, value === k && gp.chipActive]}
        onPress={() => onChange(k)}
      >
        <Text style={[gp.chipText, value === k && gp.chipTextActive]}>{l}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const gp = StyleSheet.create({
  row:          { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  chip:         { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: TVKColors.border, alignItems: 'center' },
  chipActive:   { backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  chipText:     { ...typography.caption, color: TVKColors.textSecondary, fontWeight: '600' },
  chipTextActive:{ color: TVKColors.primary },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

const RequestCertificateScreen: React.FC<{
  preselectedTypeId?: string;
}> = ({ preselectedTypeId }) => {
  const insets          = useSafeAreaInsets();
  const { theme }       = useTheme();
  const { strings }     = useAppLanguage();
  const s               = strings.requestCertificate;
  const cert            = useCertificates();

  const [searchQuery, setSearchQuery]   = useState('');
  const [isSuccess,   setIsSuccess]     = useState(false);

  // Pre-select type if coming from Documents "Apply" button
  useEffect(() => {
    if (preselectedTypeId) {
      const found = CERTIFICATE_TYPES.find(t => t.id === preselectedTypeId);
      if (found) {
        cert.selectType(found);
        cert.setStep(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedTypeId]);

  // ── Filtered catalogue ───────────────────────────────────────────────
  const filteredTypes = CERTIFICATE_TYPES.filter(ct =>
    ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ct.nameTa.includes(searchQuery) ||
    ct.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Navigation guards ────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const step = cert.currentStep;
    if (step === 1) {
      if (!cert.selectedType) {
        Alert.alert(s.required_fields, 'Please select a certificate type.');
        return;
      }
    }
    if (step === 2) {
      const d = cert.applicantDetails;
      if (!d.fullName || !d.dateOfBirth || !d.gender || !d.mobile || !d.aadhaarNumber || !d.address || !d.district) {
        Alert.alert(s.required_fields, s.fill_required);
        return;
      }
    }
    if (step === 3) {
      if (!cert.allRequiredUploaded) {
        Alert.alert(s.required_fields, s.upload_required);
        return;
      }
    }
    cert.nextStep();
  }, [cert, s]);

  const handleSubmit = useCallback(async () => {
    const result = await cert.submit();
    // @ts-ignore — thunk returns ActionCreatorWithPreparedPayload
    if (result.type.endsWith('/fulfilled')) {
      setIsSuccess(true);
    } else {
      Alert.alert('Submission Failed', cert.error ?? 'Please try again.');
    }
  }, [cert]);

  const handleDone = useCallback(() => {
    cert.resetFlow();
    router.replace('/(protected)/(tabs)/documents');
  }, [cert]);

  const handleNewRequest = useCallback(() => {
    cert.resetFlow();
    setIsSuccess(false);
  }, [cert]);

  // ── Step labels ──────────────────────────────────────────────────────
  const stepLabels = [
    s.steps.selectType,
    s.steps.applicantInfo,
    s.steps.uploadDocs,
    s.steps.review,
  ];

  // ═══════════════════════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════════════════════
  if (isSuccess && cert.submittedRequest) {
    const req = cert.submittedRequest;
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.statusBarStyle} backgroundColor={TVKColors.success} />

        <ScrollView contentContainerStyle={styles.successScroll} showsVerticalScrollIndicator={false}>
          {/* Success icon */}
          <View style={styles.successIconWrap}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-circle" size={64} color={TVKColors.white} />
            </View>
          </View>

          <Text style={styles.successTitle}>{s.successTitle}</Text>
          <Text style={styles.successSub}>{s.successSub}</Text>

          {/* Reference card */}
          <Card style={styles.refCard}>
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>{s.referenceNumber}</Text>
              <Text style={styles.refValue}>{req.referenceNumber}</Text>
            </View>
            <View style={styles.refDivider} />
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>{s.certificateType}</Text>
              <Text style={styles.refValue}>{req.certificateName}</Text>
            </View>
            <View style={styles.refDivider} />
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>{s.estimatedDate}</Text>
              <Text style={[styles.refValue, { color: TVKColors.success }]}>{req.estimatedReadyDate}</Text>
            </View>
            <View style={styles.refDivider} />
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>{s.processingFee}</Text>
              <Text style={[styles.refValue, { color: req.fee === 0 ? TVKColors.success : TVKColors.primary }]}>
                {req.fee === 0 ? s.free : `₹${req.fee}`}
              </Text>
            </View>
          </Card>

          {/* Next steps */}
          <Card style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>{s.nextSteps}</Text>
            {[s.step1Next, s.step2Next, s.step3Next].map((step, i) => (
              <View key={i} style={styles.nextStepRow}>
                <View style={styles.nextStepBullet}>
                  <Text style={styles.nextStepNum}>{i + 1}</Text>
                </View>
                <Text style={styles.nextStepText}>{step}</Text>
              </View>
            ))}
          </Card>

          {/* Actions */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleDone}>
            <Text style={styles.primaryBtnText}>{s.trackRequest}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleNewRequest}>
            <Text style={styles.secondaryBtnText}>{s.newRequest}</Text>
          </TouchableOpacity>
          <View style={{ height: insets.bottom + spacing.xl }} />
        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // WIZARD SCREEN
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (cert.currentStep === 1) router.back();
          else cert.prevStep();
        }}>
          <Ionicons name="arrow-back" size={20} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>{s.title}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelText, { color: theme.headerSubText }]}>{s.cancel}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Step Indicator ──────────────────────────────────────────── */}
      <View style={[styles.stepWrap, { backgroundColor: theme.surface }]}>
        <StepIndicator currentStep={cert.currentStep} labels={stepLabels} />
      </View>

      {/* ── Step Content ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {cert.currentStep === 1 && (
          <Step1SelectType
            types={filteredTypes}
            selectedId={cert.selectedType?.id ?? null}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onSelect={cert.selectType}
            strings={s}
          />
        )}
        {cert.currentStep === 2 && cert.selectedType && (
          <Step2ApplicantDetails
            type={cert.selectedType}
            details={cert.applicantDetails}
            onUpdate={cert.updateDetails}
            strings={s}
          />
        )}
        {cert.currentStep === 3 && cert.selectedType && (
          <Step3UploadDocs
            type={cert.selectedType}
            uploads={cert.uploadedDocuments}
            onUpload={cert.markUploaded}
            onRemove={cert.removeDoc}
            strings={s}
          />
        )}
        {cert.currentStep === 4 && cert.selectedType && (
          <Step4Review
            type={cert.selectedType}
            details={cert.applicantDetails}
            uploads={cert.uploadedDocuments}
            onEditDetails={() => cert.setStep(2)}
            strings={s}
          />
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* ── Bottom Navigation ─────────────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm, backgroundColor: theme.surface }]}>
        {cert.currentStep > 1 && (
          <TouchableOpacity style={styles.backBtnBottom} onPress={cert.prevStep}>
            <Ionicons name="arrow-back" size={16} color={TVKColors.primary} />
            <Text style={styles.backBtnText}>{s.back}</Text>
          </TouchableOpacity>
        )}
        {cert.currentStep < TOTAL_STEPS ? (
          <TouchableOpacity
            style={[styles.nextBtn, cert.currentStep === 1 && !cert.selectedType && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={cert.currentStep === 1 && !cert.selectedType}
          >
            <Text style={styles.nextBtnText}>{s.next}</Text>
            <Ionicons name="arrow-forward" size={16} color={TVKColors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, cert.isSubmitting && styles.nextBtnDisabled]}
            onPress={handleSubmit}
            disabled={cert.isSubmitting}
          >
            {cert.isSubmitting
              ? <ActivityIndicator color={TVKColors.white} size="small" />
              : <Text style={styles.nextBtnText}>{s.submitBtn}</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 – SELECT CERTIFICATE TYPE
// ═══════════════════════════════════════════════════════════════════════════

const Step1SelectType: React.FC<{
  types:       CertificateType[];
  selectedId:  string | null;
  searchQuery: string;
  onSearch:    (q: string) => void;
  onSelect:    (t: CertificateType) => void;
  strings:     CertStrings;
}> = ({ types, selectedId, searchQuery, onSearch, onSelect, strings }) => {
  const categories = ['Civil', 'Financial', 'Social', 'Property', 'Educational'];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const displayed = activeCategory === 'All'
    ? types
    : types.filter(t => t.category === activeCategory);

  return (
    <View>
      <Text style={step1.heading}>{strings.chooseCategory}</Text>

      {/* Search bar */}
      <View style={step1.searchWrap}>
        <Ionicons name="search" size={16} color={TVKColors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={step1.searchInput}
          value={searchQuery}
          onChangeText={onSearch}
          placeholder={strings.searchPlaceholder}
          placeholderTextColor={TVKColors.textTertiary}
        />
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={step1.catScroll} contentContainerStyle={{ gap: 8 }}>
        {['All', ...categories].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[step1.catChip, activeCategory === cat && step1.catChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[step1.catText, activeCategory === cat && step1.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Certificate cards */}
      {displayed.map(ct => (
        <TouchableOpacity
          key={ct.id}
          style={[step1.card, selectedId === ct.id && step1.cardSelected]}
          onPress={() => onSelect(ct)}
          activeOpacity={0.8}
        >
          <View style={step1.cardLeft}>
            <Text style={step1.emoji}>{ct.emoji}</Text>
            <View style={step1.cardInfo}>
              <Text style={step1.cardName}>{ct.name}</Text>
              <Text style={step1.cardMeta}>{ct.category}</Text>
              <Text style={step1.cardDesc} numberOfLines={2}>{ct.description}</Text>
            </View>
          </View>
          <View style={step1.cardRight}>
            <Text style={[step1.fee, ct.fee === 0 && step1.feeFree]}>
              {ct.fee === 0 ? strings.free : `₹${ct.fee}`}
            </Text>
            <Text style={step1.days}>{ct.processingDays}d</Text>
            {selectedId === ct.id && (
              <Ionicons name="checkmark-circle" size={20} color={TVKColors.primary} style={{ marginTop: 4 }} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const step1 = StyleSheet.create({
  heading:        { ...typography.h4, color: TVKColors.textPrimary, marginBottom: spacing.md },
  searchWrap:     { flexDirection: 'row', alignItems: 'center', backgroundColor: TVKColors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: TVKColors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm },
  searchInput:    { flex: 1, ...typography.body2, color: TVKColors.textPrimary },
  catScroll:      { marginBottom: spacing.md },
  catChip:        { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: TVKColors.background, borderWidth: 0.5, borderColor: TVKColors.border },
  catChipActive:  { backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  catText:        { ...typography.caption, color: TVKColors.textSecondary, fontWeight: '500' },
  catTextActive:  { color: TVKColors.primary, fontWeight: '700' },
  card:           { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: TVKColors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1.5, borderColor: TVKColors.border },
  cardSelected:   { borderColor: TVKColors.primary, backgroundColor: TVKColors.primaryLight },
  cardLeft:       { flexDirection: 'row', flex: 1, gap: spacing.md },
  emoji:          { fontSize: 28, marginTop: 2 },
  cardInfo:       { flex: 1 },
  cardName:       { ...typography.h5, color: TVKColors.textPrimary },
  cardMeta:       { ...typography.micro, color: TVKColors.textSecondary, marginTop: 2 },
  cardDesc:       { ...typography.caption, color: TVKColors.textTertiary, marginTop: 4 },
  cardRight:      { alignItems: 'flex-end', gap: 4, minWidth: 48 },
  fee:            { ...typography.caption, color: TVKColors.primary, fontWeight: '700' },
  feeFree:        { color: TVKColors.success },
  days:           { ...typography.micro, color: TVKColors.textSecondary },
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 – APPLICANT DETAILS
// ═══════════════════════════════════════════════════════════════════════════

const Step2ApplicantDetails: React.FC<{
  type:      CertificateType;
  details:   Record<string, string>;
  onUpdate:  (d: Record<string, string>) => void;
  strings:   CertStrings;
}> = ({ type, details, onUpdate, strings }) => {
  const val   = (key: string) => (details as Record<string, string>)[key] ?? '';
  const set   = (key: string) => (text: string) => onUpdate({ [key]: text });

  return (
    <View>
      {/* Certificate type reminder */}
      <View style={step2.certBadge}>
        <Text style={step2.certEmoji}>{type.emoji}</Text>
        <View>
          <Text style={step2.certName}>{type.name}</Text>
          <Text style={step2.certFee}>
            {type.fee === 0 ? strings.free : `₹${type.fee}`} · {type.processingDays} {strings.days}
          </Text>
        </View>
      </View>

      <Text style={step2.sectionTitle}>{strings.applicantDetails}</Text>

      {/* Common fields */}
      <FormField label={strings.fullName}    value={val('fullName')}    onChangeText={set('fullName')} />
      <FormField label={strings.dateOfBirth} value={val('dateOfBirth')} onChangeText={set('dateOfBirth')} placeholder="DD/MM/YYYY" />

      <Text style={ff.label}>{strings.gender}</Text>
      <GenderPicker
        value={val('gender')}
        onChange={v => onUpdate({ gender: v })}
        strings={{ male: strings.male, female: strings.female, other: strings.other }}
      />

      <FormField label={strings.mobile}     value={val('mobile')}     onChangeText={set('mobile')}     keyboardType="phone-pad" maxLength={10} />
      <FormField label={strings.email}      value={val('email')}      onChangeText={set('email')}      keyboardType="email-address" />
      <FormField label={strings.aadhaar}    value={val('aadhaarNumber')} onChangeText={set('aadhaarNumber')} keyboardType="numeric" maxLength={12} />
      <FormField label={strings.fatherName} value={val('fatherName')} onChangeText={set('fatherName')} />
      <FormField label={strings.address}    value={val('address')}    onChangeText={set('address')} />

      {/* District picker (simplified as text input) */}
      <View style={ff.wrap}>
        <Text style={ff.label}>{strings.district}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }} contentContainerStyle={{ gap: 6 }}>
          {TN_DISTRICTS.slice(0, 8).map(d => (
            <TouchableOpacity
              key={d}
              style={[step2.districtChip, val('district') === d && step2.districtChipActive]}
              onPress={() => onUpdate({ district: d })}
            >
              <Text style={[step2.districtText, val('district') === d && step2.districtTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={ff.input}
          value={val('district')}
          onChangeText={set('district')}
          placeholder={strings.district.replace(' *', '')}
          placeholderTextColor={TVKColors.textTertiary}
        />
      </View>

      <FormField label={strings.taluk}   value={val('taluk')}   onChangeText={set('taluk')} />
      <FormField label={strings.pincode} value={val('pincode')} onChangeText={set('pincode')} keyboardType="numeric" maxLength={6} />

      {/* Certificate-specific extra fields */}
      {(type.id === 'income') && (
        <FormField label={strings.annualIncome} value={val('annualIncome')} onChangeText={set('annualIncome')} keyboardType="numeric" />
      )}
      {(type.id === 'community') && (
        <>
          <FormField label={strings.communityName} value={val('communityName')} onChangeText={set('communityName')} />
          <FormField label={strings.religion}       value={val('religion')}       onChangeText={set('religion')} />
        </>
      )}
      {(type.id === 'birth' || type.id === 'nativity') && (
        <FormField label={strings.placeOfBirth} value={val('placeOfBirth')} onChangeText={set('placeOfBirth')} />
      )}
    </View>
  );
};

const step2 = StyleSheet.create({
  certBadge:         { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: TVKColors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 0.5, borderColor: `${TVKColors.primary}40` },
  certEmoji:         { fontSize: 28 },
  certName:          { ...typography.h5, color: TVKColors.primaryDark },
  certFee:           { ...typography.caption, color: TVKColors.textSecondary, marginTop: 2 },
  sectionTitle:      { ...typography.h4, color: TVKColors.textPrimary, marginBottom: spacing.md },
  districtChip:      { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full, backgroundColor: TVKColors.background, borderWidth: 0.5, borderColor: TVKColors.border, marginBottom: 8 },
  districtChipActive:{ backgroundColor: TVKColors.primaryLight, borderColor: TVKColors.primary },
  districtText:      { ...typography.micro, color: TVKColors.textSecondary },
  districtTextActive:{ color: TVKColors.primary, fontWeight: '600' },
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 – UPLOAD DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════

const Step3UploadDocs: React.FC<{
  type:     CertificateType;
  uploads:  { docId: string; fileName: string; fileSize: string; uploaded: boolean }[];
  onUpload: (docId: string, fileName: string, fileSize: string) => void;
  onRemove: (docId: string) => void;
  strings:  CertStrings;
}> = ({ type, uploads, onUpload, onRemove, strings }) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const simulateUpload = async (docId: string, docLabel: string) => {
    setUploading(docId);
    // Simulate file picker + upload (1.5s)
    await new Promise(r => setTimeout(r, 1500));
    const mockFiles = ['scan_001.pdf', 'document.jpg', 'copy.png', 'record.pdf'];
    const mockFile  = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    const mockSize  = `${(Math.random() * 1.8 + 0.2).toFixed(1)} MB`;
    onUpload(docId, `${docLabel.split(' ')[0]}_${mockFile}`, mockSize);
    setUploading(null);
  };

  return (
    <View>
      <Text style={step3.heading}>{strings.uploadDocuments}</Text>
      <Text style={step3.hint}>{strings.uploadHint}</Text>

      {type.requiredDocuments.map(doc => {
        const upload = uploads.find(u => u.docId === doc.id);
        const isUp   = upload?.uploaded ?? false;
        const isBusy = uploading === doc.id;

        return (
          <Card key={doc.id} style={StyleSheet.flatten([step3.docCard, isUp ? step3.docCardDone : null]) as ViewStyle}>
            <View style={step3.docTop}>
              <View style={step3.docLabelWrap}>
                <Text style={step3.docLabel}>{doc.label}</Text>
                <View style={[step3.badge, doc.required ? step3.badgeRequired : step3.badgeOptional]}>
                  <Text style={[step3.badgeText, doc.required ? step3.badgeTextRequired : step3.badgeTextOptional]}>
                    {doc.required ? strings.required : strings.optional}
                  </Text>
                </View>
              </View>
              {isUp
                ? <TouchableOpacity onPress={() => onRemove(doc.id)} style={step3.removeBtn}>
                    <Ionicons name="close-circle" size={20} color={TVKColors.error} />
                  </TouchableOpacity>
                : <TouchableOpacity
                    style={[step3.uploadBtn, isBusy && step3.uploadBtnBusy]}
                    onPress={() => simulateUpload(doc.id, doc.label)}
                    disabled={isBusy}
                  >
                    {isBusy
                      ? <ActivityIndicator size="small" color={TVKColors.white} />
                      : <>
                          <Ionicons name="cloud-upload-outline" size={14} color={TVKColors.white} />
                          <Text style={step3.uploadBtnText}>{strings.uploadBtn}</Text>
                        </>
                    }
                  </TouchableOpacity>
              }
            </View>
            <Text style={step3.docHint}>{doc.hint}</Text>
            {isUp && upload && (
              <View style={step3.uploadedInfo}>
                <Ionicons name="document-text-outline" size={14} color={TVKColors.success} />
                <Text style={step3.uploadedName}>{upload.fileName}</Text>
                <Text style={step3.uploadedSize}>{upload.fileSize}</Text>
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );
};

const step3 = StyleSheet.create({
  heading:           { ...typography.h4, color: TVKColors.textPrimary, marginBottom: 4 },
  hint:              { ...typography.caption, color: TVKColors.textSecondary, marginBottom: spacing.lg },
  docCard:           { marginBottom: spacing.sm, borderWidth: 1.5, borderColor: TVKColors.border },
  docCardDone:       { borderColor: TVKColors.success, backgroundColor: TVKColors.successLight },
  docTop:            { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  docLabelWrap:      { flex: 1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 },
  docLabel:          { ...typography.body2, color: TVKColors.textPrimary, fontWeight: '600', flexShrink: 1 },
  badge:             { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm, alignSelf: 'flex-start' },
  badgeRequired:     { backgroundColor: TVKColors.errorLight },
  badgeOptional:     { backgroundColor: TVKColors.border },
  badgeText:         { fontSize: 10, fontWeight: '700' },
  badgeTextRequired: { color: TVKColors.error },
  badgeTextOptional: { color: TVKColors.textSecondary },
  docHint:           { ...typography.micro, color: TVKColors.textSecondary, marginTop: 4 },
  uploadBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: TVKColors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.md, minWidth: 80, justifyContent: 'center' },
  uploadBtnBusy:     { backgroundColor: TVKColors.textTertiary },
  uploadBtnText:     { ...typography.micro, color: TVKColors.white, fontWeight: '700' },
  removeBtn:         { padding: 2 },
  uploadedInfo:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 0.5, borderTopColor: TVKColors.success },
  uploadedName:      { ...typography.micro, color: TVKColors.success, fontWeight: '600', flex: 1 },
  uploadedSize:      { ...typography.micro, color: TVKColors.textSecondary },
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4 – REVIEW
// ═══════════════════════════════════════════════════════════════════════════

const Step4Review: React.FC<{
  type:          CertificateType;
  details:       Record<string, string>;
  uploads:       { docId: string; fileName: string; uploaded: boolean }[];
  onEditDetails: () => void;
  strings:       CertStrings;
}> = ({ type, details, uploads, onEditDetails, strings }) => {
  const val = (key: string) => (details as Record<string, string>)[key] ?? '—';

  const reviewRows: { label: string; value: string }[] = [
    { label: 'Full Name',    value: val('fullName') },
    { label: 'Date of Birth', value: val('dateOfBirth') },
    { label: 'Gender',       value: val('gender') },
    { label: 'Mobile',       value: val('mobile') },
    { label: 'Aadhaar',      value: val('aadhaarNumber') },
    { label: 'Father Name',  value: val('fatherName') },
    { label: 'Address',      value: val('address') },
    { label: 'District',     value: val('district') },
    { label: 'Taluk',        value: val('taluk') },
    { label: 'Pincode',      value: val('pincode') },
  ];

  return (
    <View>
      <Text style={step4.heading}>{strings.reviewTitle}</Text>
      <Text style={step4.sub}>{strings.reviewSub}</Text>

      {/* Certificate summary */}
      <Card style={step4.certCard}>
        <View style={step4.certRow}>
          <Text style={step4.certEmoji}>{type.emoji}</Text>
          <View style={step4.certInfo}>
            <Text style={step4.certName}>{type.name}</Text>
            <Text style={step4.certCategory}>{type.category}</Text>
          </View>
        </View>
        <View style={step4.divider} />
        <View style={step4.metaRow}>
          <View style={step4.metaItem}>
            <Text style={step4.metaLabel}>{strings.processingFee}</Text>
            <Text style={[step4.metaValue, { color: type.fee === 0 ? TVKColors.success : TVKColors.primary }]}>
              {type.fee === 0 ? strings.free : `₹${type.fee}`}
            </Text>
          </View>
          <View style={step4.metaItem}>
            <Text style={step4.metaLabel}>{strings.processingTime}</Text>
            <Text style={step4.metaValue}>{type.processingDays} {strings.days}</Text>
          </View>
        </View>
      </Card>

      {/* Applicant details */}
      <View style={step4.sectionHeader}>
        <Text style={step4.sectionTitle}>{strings.applicantDetails}</Text>
        <TouchableOpacity onPress={onEditDetails}>
          <Text style={step4.editLink}>{strings.editDetails}</Text>
        </TouchableOpacity>
      </View>
      <Card style={step4.detailsCard}>
        {reviewRows.filter(r => r.value !== '—').map((row, i) => (
          <React.Fragment key={row.label}>
            {i > 0 && <View style={step4.rowDivider} />}
            <View style={step4.detailRow}>
              <Text style={step4.detailLabel}>{row.label}</Text>
              <Text style={step4.detailValue}>{row.value}</Text>
            </View>
          </React.Fragment>
        ))}
      </Card>

      {/* Documents */}
      <Text style={[step4.sectionTitle, { marginBottom: spacing.sm }]}>{strings.requiredDocuments}</Text>
      <Card style={step4.docsCard}>
        {uploads.filter(u => u.uploaded).map((u, i) => (
          <React.Fragment key={u.docId}>
            {i > 0 && <View style={step4.rowDivider} />}
            <View style={step4.docRow}>
              <Ionicons name="document-text-outline" size={16} color={TVKColors.success} />
              <Text style={step4.docName}>{u.fileName}</Text>
              <Ionicons name="checkmark-circle" size={16} color={TVKColors.success} />
            </View>
          </React.Fragment>
        ))}
      </Card>

      {/* Declaration */}
      <Card style={step4.declarationCard}>
        <Ionicons name="information-circle-outline" size={18} color={TVKColors.info} />
        <Text style={step4.declarationText}>
          By submitting, I declare that all information provided is accurate and the documents are genuine.
          I understand that providing false information is punishable under Tamil Nadu Government rules.
        </Text>
      </Card>
    </View>
  );
};

const step4 = StyleSheet.create({
  heading:         { ...typography.h4, color: TVKColors.textPrimary, marginBottom: 4 },
  sub:             { ...typography.caption, color: TVKColors.textSecondary, marginBottom: spacing.lg },
  certCard:        { marginBottom: spacing.md },
  certRow:         { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  certEmoji:       { fontSize: 30 },
  certInfo:        { flex: 1 },
  certName:        { ...typography.h5, color: TVKColors.textPrimary },
  certCategory:    { ...typography.caption, color: TVKColors.textSecondary, marginTop: 2 },
  divider:         { height: 0.5, backgroundColor: TVKColors.divider, marginVertical: spacing.md },
  metaRow:         { flexDirection: 'row', gap: spacing.xl },
  metaItem:        {},
  metaLabel:       { ...typography.micro, color: TVKColors.textSecondary },
  metaValue:       { ...typography.h5, color: TVKColors.textPrimary, marginTop: 2 },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md },
  sectionTitle:    { ...typography.h5, color: TVKColors.textPrimary, fontWeight: '700' },
  editLink:        { ...typography.caption, color: TVKColors.primary, fontWeight: '600' },
  detailsCard:     { marginBottom: spacing.md },
  rowDivider:      { height: 0.5, backgroundColor: TVKColors.divider, marginVertical: 8 },
  detailRow:       { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  detailLabel:     { ...typography.caption, color: TVKColors.textSecondary, flex: 1 },
  detailValue:     { ...typography.caption, color: TVKColors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right' },
  docsCard:        { marginBottom: spacing.md },
  docRow:          { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  docName:         { ...typography.caption, color: TVKColors.textPrimary, flex: 1 },
  declarationCard: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', backgroundColor: TVKColors.infoLight, borderWidth: 0.5, borderColor: TVKColors.info },
  declarationText: { ...typography.micro, color: TVKColors.info, flex: 1, lineHeight: 18 },
});

// ─── Shared strings prop type ────────────────────────────────────────────────
type CertStrings = AppStrings['requestCertificate'];

// ─── Main Screen Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:         { flex: 1 },
  header:       { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle:  { ...typography.h4, flex: 1, textAlign: 'center' },
  backBtn:      { padding: 4 },
  cancelText:   { ...typography.body2 },
  stepWrap:     { borderBottomWidth: 0.5, borderBottomColor: TVKColors.border },
  scroll:       { flex: 1 },
  scrollContent:{ padding: spacing.lg },
  bottomBar:    { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md, borderTopWidth: 0.5, borderTopColor: TVKColors.border },
  backBtnBottom:{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: TVKColors.primary },
  backBtnText:  { ...typography.body2, color: TVKColors.primary, fontWeight: '600' },
  nextBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: TVKColors.primary, borderRadius: radius.md, paddingVertical: spacing.md },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText:  { ...typography.body1, color: TVKColors.white, fontWeight: '700' },

  // Success
  successScroll:  { padding: spacing.lg, alignItems: 'center' },
  successIconWrap:{ marginTop: spacing.xl, marginBottom: spacing.lg },
  successCircle:  { width: 100, height: 100, borderRadius: 50, backgroundColor: TVKColors.success, alignItems: 'center', justifyContent: 'center' },
  successTitle:   { ...typography.h2, color: TVKColors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  successSub:     { ...typography.body2, color: TVKColors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  refCard:        { width: '100%', marginBottom: spacing.md },
  refRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  refDivider:     { height: 0.5, backgroundColor: TVKColors.divider },
  refLabel:       { ...typography.caption, color: TVKColors.textSecondary },
  refValue:       { ...typography.body2, color: TVKColors.textPrimary, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: spacing.md },
  nextStepsCard:  { width: '100%', marginBottom: spacing.lg },
  nextStepsTitle: { ...typography.h5, color: TVKColors.textPrimary, marginBottom: spacing.md, fontWeight: '700' },
  nextStepRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  nextStepBullet: { width: 22, height: 22, borderRadius: 11, backgroundColor: TVKColors.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  nextStepNum:    { ...typography.micro, color: TVKColors.primary, fontWeight: '700' },
  nextStepText:   { ...typography.caption, color: TVKColors.textSecondary, flex: 1, lineHeight: 18 },
  primaryBtn:     { width: '100%', backgroundColor: TVKColors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginBottom: spacing.sm },
  primaryBtnText: { ...typography.body1, color: TVKColors.white, fontWeight: '700' },
  secondaryBtn:   { width: '100%', borderWidth: 1.5, borderColor: TVKColors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  secondaryBtnText:{ ...typography.body1, color: TVKColors.primary, fontWeight: '700' },
});

export default RequestCertificateScreen;
