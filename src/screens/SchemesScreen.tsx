import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import FilterBar, { FilterOption } from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import SectionTitle from '../components/SectionTitle';
import { TVKColors } from '../theme';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { useTheme } from '../hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopPromise {
  id: string;
  title: string;
  titleTA: string;
  detail: string;
  detailTA: string;
  emoji: string;
  color: string;
  bgColor: string;
}

type SchemeCategory = 'all' | 'education' | 'youth' | 'farmers' | 'workers' | 'women' | 'governance';

interface Scheme {
  id: string;
  name: string;
  nameTA: string;
  desc: string;
  descTA: string;
  amount: string;
  dept: string;
  deptTA: string;
  category: Exclude<SchemeCategory, 'all'>;
  eligible: boolean;
  color: string;
  bgColor: string;
  emoji: string;
}

// ─── TVK 2026 Top 5 Promises ─────────────────────────────────────────────────

const TOP_PROMISES: TopPromise[] = [
  {
    id: 'P1',
    title: '200 Units\nFree Power',
    titleTA: '200 யூனிட்\nஇலவச மின்சாரம்',
    detail: 'Every Household',
    detailTA: 'ஒவ்வொரு வீட்டிற்கும்',
    emoji: '⚡',
    color: TVKColors.accentDark,
    bgColor: TVKColors.accentLight,
  },
  {
    id: 'P2',
    title: '6 Free LPG\nCylinders',
    titleTA: '6 இலவச\nகுழாய் எரிவாயு',
    detail: 'Per Family / Year',
    detailTA: 'குடும்பத்திற்கு / ஆண்டு',
    emoji: '🔥',
    color: TVKColors.primary,
    bgColor: TVKColors.primaryLight,
  },
  {
    id: 'P3',
    title: '8 Grams\nof Gold',
    titleTA: '8 கிராம்\nதங்கம்',
    detail: 'Eligible Poor Brides',
    detailTA: 'ஏழை மணப்பெண்களுக்கு',
    emoji: '💛',
    color: TVKColors.accentDark,
    bgColor: TVKColors.yellowLight,
  },
  {
    id: 'P4',
    title: '₹2,500/month\nfor Women',
    titleTA: 'பெண்களுக்கு\n₹2,500/மாதம்',
    detail: 'Financial Assistance',
    detailTA: 'நிதி உதவி',
    emoji: '👩',
    color: TVKColors.primary,
    bgColor: TVKColors.primaryLight,
  },
  {
    id: 'P5',
    title: '₹25 Lakh\nHealth Cover',
    titleTA: '₹25 லட்சம்\nசுகாதார காப்பு',
    detail: 'Every Family',
    detailTA: 'ஒவ்வொரு குடும்பமும்',
    emoji: '🏥',
    color: TVKColors.success,
    bgColor: TVKColors.successLight,
  },
];

// ─── Full TVK 2026 Manifesto Schemes ─────────────────────────────────────────

const SCHEMES: Scheme[] = [
  // ── Education & Students ──────────────────────────────────────────────────
  {
    id: 'E1', category: 'education',
    name: 'Mother Support Scheme', nameTA: 'தாய் ஆதரவு திட்டம்',
    desc: '₹15,000 annual support for mothers/guardians of children in Govt & Govt-aided schools',
    descTA: 'அரசு மற்றும் அரசு உதவி பெறும் பள்ளி மாணவர் பெற்றோருக்கு ₹15,000 ஆண்டு உதவி',
    amount: '₹15,000 / year', dept: 'School Education Dept', deptTA: 'பள்ளி கல்வி துறை',
    eligible: true, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '👩‍👧',
  },
  {
    id: 'E2', category: 'education',
    name: 'Higher Education Loan', nameTA: 'உயர்கல்வி கடன்',
    desc: 'Education loan up to ₹20 Lakh for higher studies',
    descTA: 'உயர்கல்விக்கு ₹20 லட்சம் வரை கல்விக் கடன் உதவி',
    amount: 'Up to ₹20 Lakh', dept: 'Higher Education Dept', deptTA: 'உயர் கல்வி துறை',
    eligible: false, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🎓',
  },
  {
    id: 'E3', category: 'education',
    name: '100 Kamaraj Residential Schools', nameTA: '100 காமராஜர் வாழிட பள்ளிகள்',
    desc: 'Modern world-class residential school education for deserving students',
    descTA: 'தகுதியான மாணவர்களுக்கு நவீன உலகத்தர வாழிட பள்ளிக் கல்வி',
    amount: 'Free Residential', dept: 'School Education Dept', deptTA: 'பள்ளி கல்வி துறை',
    eligible: false, color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '🏫',
  },
  {
    id: 'E4', category: 'education',
    name: 'AI-Powered Free Coaching', nameTA: 'AI இலவச பயிற்சி',
    desc: 'Free AI-powered coaching for all competitive exams (TNPSC, UPSC, NEET & more)',
    descTA: 'அனைத்து போட்டித் தேர்வுகளுக்கும் (TNPSC, UPSC, NEET) இலவச AI பயிற்சி',
    amount: 'Free', dept: 'School Education Dept', deptTA: 'பள்ளி கல்வி துறை',
    eligible: true, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🤖',
  },

  // ── Youth & Employment ────────────────────────────────────────────────────
  {
    id: 'Y1', category: 'youth',
    name: 'Unemployment Assistance', nameTA: 'வேலையின்மை உதவி',
    desc: '₹4,000/month for graduates and ₹2,500/month for diploma holders seeking employment',
    descTA: 'பட்டதாரிகளுக்கு ₹4,000/மாதம், டிப்ளோமா தாரர்களுக்கு ₹2,500/மாதம்',
    amount: '₹2,500 – ₹4,000 / month', dept: 'Employment Dept', deptTA: 'வேலைவாய்ப்பு துறை',
    eligible: true, color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '💼',
  },
  {
    id: 'Y2', category: 'youth',
    name: 'Internship Stipend', nameTA: 'இன்டர்ன்ஷிப் உதவித்தொகை',
    desc: 'Monthly stipend of ₹5,000–₹8,000 for students doing government internships',
    descTA: 'அரசு இன்டர்ன்ஷிப்பில் மாதாந்திர ₹5,000–₹8,000 உதவித்தொகை',
    amount: '₹5,000 – ₹8,000 / month', dept: 'Employment Dept', deptTA: 'வேலைவாய்ப்பு துறை',
    eligible: true, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '📋',
  },
  {
    id: 'Y3', category: 'youth',
    name: 'Employment for 5 Lakh Youth', nameTA: '5 லட்சம் வேலைவாய்ப்பு',
    desc: 'Create 5 lakh employment opportunities by linking skills with the job market',
    descTA: 'திறன்களை வேலை சந்தையுடன் இணைத்து 5 லட்சம் வேலைவாய்ப்பு உருவாக்கல்',
    amount: '5 Lakh Jobs', dept: 'Employment Dept', deptTA: 'வேலைவாய்ப்பு துறை',
    eligible: false, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🚀',
  },
  {
    id: 'Y4', category: 'youth',
    name: 'Start-Up Loan', nameTA: 'தொடக்க நிதி கடன்',
    desc: 'Low-interest startup loan up to ₹5 Lakh for young entrepreneurs',
    descTA: 'இளம் தொழில்முனைவோருக்கு ₹5 லட்சம் வரை குறைந்த வட்டியில் கடன்',
    amount: 'Up to ₹5 Lakh', dept: 'Industries Dept', deptTA: 'தொழில் துறை',
    eligible: false, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '💡',
  },
  {
    id: 'Y5', category: 'youth',
    name: 'Business Loan', nameTA: 'வணிக கடன்',
    desc: 'Business loan up to ₹25 Lakh for small and medium enterprises',
    descTA: 'சிறு மற்றும் நடுத்தர தொழில்களுக்கு ₹25 லட்சம் வரை வணிக கடன்',
    amount: 'Up to ₹25 Lakh', dept: 'Industries Dept', deptTA: 'தொழில் துறை',
    eligible: false, color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '🏢',
  },
  {
    id: 'Y6', category: 'youth',
    name: 'Fixed Exam Timetable', nameTA: 'நிலையான தேர்வு அட்டவணை',
    desc: 'Fixed and transparent timetable for all government recruitment examinations',
    descTA: 'அனைத்து அரசு ஆட்சேர்ப்பு தேர்வுகளுக்கும் நிலையான வெளிப்படையான அட்டவணை',
    amount: 'Policy Reform', dept: 'TNPSC / Recruitment', deptTA: 'TNPSC / ஆட்சேர்ப்பு',
    eligible: true, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '📅',
  },

  // ── Farmers, Fishermen & Rural ───────────────────────────────────────────
  {
    id: 'F1', category: 'farmers',
    name: 'Full Agricultural Loan Waiver', nameTA: 'விவசாய கடன் தள்ளுபடி',
    desc: 'Complete waiver of agricultural cooperative crop loans for farmers with less than 5 acres',
    descTA: '5 ஏக்கருக்கும் குறைவான விவசாயிகளின் கூட்டுறவு பயிர்க் கடன் முழுமையாக தள்ளுபடி',
    amount: 'Full Waiver', dept: 'Agriculture Dept', deptTA: 'வேளாண்மை துறை',
    eligible: true, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🌾',
  },
  {
    id: 'F2', category: 'farmers',
    name: '50% Loan Relief', nameTA: '50% கடன் நிவாரணம்',
    desc: '50% loan relief for larger landholding farmers (conditions apply)',
    descTA: 'பெரிய நிலமுடைய விவசாயிகளுக்கு 50% கடன் நிவாரணம் (நிபந்தனைகள் பொருந்தும்)',
    amount: '50% Relief', dept: 'Agriculture Dept', deptTA: 'வேளாண்மை துறை',
    eligible: false, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🚜',
  },
  {
    id: 'F3', category: 'farmers',
    name: '100% Crop Insurance', nameTA: '100% பயிர் காப்பீடு',
    desc: 'Full crop insurance coverage for all landholding farmers and farm labourers',
    descTA: 'அனைத்து விவசாயிகள் மற்றும் கூலித் தொழிலாளர்களுக்கு முழு பயிர் காப்பீடு',
    amount: 'Full Coverage', dept: 'Agriculture Dept', deptTA: 'வேளாண்மை துறை',
    eligible: true, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🌱',
  },
  {
    id: 'F4', category: 'farmers',
    name: 'MSP Guarantee', nameTA: 'MSP உத்தரவாதம்',
    desc: 'Minimum support price guarantee for paddy and sugarcane crops',
    descTA: 'நெல் மற்றும் கரும்பு பயிர்களுக்கு குறைந்தபட்ச ஆதார விலை உத்தரவாதம்',
    amount: 'Price Guarantee', dept: 'Agriculture Dept', deptTA: 'வேளாண்மை துறை',
    eligible: true, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🌿',
  },
  {
    id: 'F5', category: 'farmers',
    name: 'Annual Farm Assistance', nameTA: 'ஆண்டு விவசாய உதவி',
    desc: 'Annual financial assistance for landholding farmers and farm labourers',
    descTA: 'நிலமுடைய விவசாயிகள் மற்றும் கூலித் தொழிலாளர்களுக்கு ஆண்டு நிதி உதவி',
    amount: 'Annual Benefit', dept: 'Agriculture Dept', deptTA: 'வேளாண்மை துறை',
    eligible: false, color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '👨‍🌾',
  },

  // ── Workers & Employees ──────────────────────────────────────────────────
  {
    id: 'W1', category: 'workers',
    name: 'Old Pension Scheme Restored', nameTA: 'பழைய ஓய்வூதிய திட்டம் மீட்டல்',
    desc: 'Restore old pension scheme or provide better pension for all government employees',
    descTA: 'அரசு ஊழியர்களுக்கு பழைய ஓய்வூதிய திட்டம் மீட்டல் அல்லது சிறந்த ஓய்வூதியம்',
    amount: 'Pension Restored', dept: 'Finance Dept', deptTA: 'நிதி துறை',
    eligible: false, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '🏛️',
  },
  {
    id: 'W2', category: 'workers',
    name: 'Anganwadi Workers Salary', nameTA: 'அங்கன்வாடி ஊழியர் சம்பளம்',
    desc: '₹18,000 monthly salary for Anganwadi workers',
    descTA: 'அங்கன்வாடி ஊழியர்களுக்கு ₹18,000 மாத சம்பளம்',
    amount: '₹18,000 / month', dept: 'Social Welfare Dept', deptTA: 'சமூக நலன் துறை',
    eligible: false, color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '👩‍⚕️',
  },
  {
    id: 'W3', category: 'workers',
    name: 'Sanitation Workers Salary', nameTA: 'சுகாதார ஊழியர் சம்பளம்',
    desc: '₹10,000 monthly salary for sanitation workers',
    descTA: 'சுகாதார ஊழியர்களுக்கு ₹10,000 மாத சம்பளம்',
    amount: '₹10,000 / month', dept: 'Municipal Admin Dept', deptTA: 'நகராட்சி நிர்வாக துறை',
    eligible: false, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🧹',
  },
  {
    id: 'W4', category: 'workers',
    name: 'Contract Staff Regularisation', nameTA: 'ஒப்பந்த ஊழியர் நிரந்தரமாக்கல்',
    desc: 'Regularisation of contract staff after 5 years of continuous service',
    descTA: '5 ஆண்டுகள் தொடர்ந்து சேவை செய்த ஒப்பந்த ஊழியர்களை நிரந்தரமாக்கல்',
    amount: 'Permanent Job', dept: 'HR & Admin Dept', deptTA: 'மனிட வள துறை',
    eligible: false, color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '📝',
  },
  {
    id: 'W5', category: 'workers',
    name: 'Retirement Benefit', nameTA: 'ஓய்வு நிவாரண நலன்',
    desc: '₹15 Lakh retirement benefit for government employees after long service',
    descTA: 'நீண்ட சேவை முடித்த அரசு ஊழியர்களுக்கு ₹15 லட்சம் ஓய்வு நிவாரணம்',
    amount: '₹15 Lakh', dept: 'Finance Dept', deptTA: 'நிதி துறை',
    eligible: false, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🎖️',
  },

  // ── Women, Seniors & Social Welfare ─────────────────────────────────────
  {
    id: 'S1', category: 'women',
    name: 'Magalir Urimai Thittam', nameTA: 'மகளிர் உரிமை திட்டம்',
    desc: 'Monthly financial assistance for women heads of household',
    descTA: 'குடும்பத் தலைவி பெண்களுக்கு மாதாந்திர நிதி உதவி',
    amount: '₹2,500 / month', dept: 'Social Welfare Dept', deptTA: 'சமூக நலன் துறை',
    eligible: true, color: TVKColors.primary, bgColor: TVKColors.primaryLight, emoji: '👩',
  },
  {
    id: 'S2', category: 'women',
    name: 'Senior Citizens Monthly Assistance', nameTA: 'முதியோர் மாதாந்திர உதவி',
    desc: '₹3,000/month for senior citizens, widows and persons with disabilities',
    descTA: 'முதியோர், விதவைகள் மற்றும் மாற்றுத்திறனாளிகளுக்கு ₹3,000/மாதம்',
    amount: '₹3,000 / month', dept: 'Social Welfare Dept', deptTA: 'சமூக நலன் துறை',
    eligible: false, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '👴',
  },
  {
    id: 'S3', category: 'women',
    name: 'Free House Pattas', nameTA: 'இலவச வீட்டு பட்டா',
    desc: 'Free house pattas on government land for eligible families',
    descTA: 'தகுதியான குடும்பங்களுக்கு அரசு நிலத்தில் இலவச வீட்டு பட்டா',
    amount: 'Free Patta', dept: 'Housing Board', deptTA: 'வீட்டுவசதி வாரியம்',
    eligible: false, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🏠',
  },
  {
    id: 'S4', category: 'women',
    name: '100% Drinking Water Access', nameTA: '100% குடிநீர் வசதி',
    desc: 'Piped or pump water access for every household across Tamil Nadu',
    descTA: 'தமிழ்நாட்டில் ஒவ்வொரு வீட்டிற்கும் குழாய் அல்லது பம்ப் குடிநீர் வசதி',
    amount: 'Universal Access', dept: 'Water Supply Dept', deptTA: 'குடிநீர் வழங்கல் துறை',
    eligible: true, color: TVKColors.info, bgColor: TVKColors.infoLight, emoji: '💧',
  },
  {
    id: 'S5', category: 'women',
    name: 'Gold Ring for Newborns', nameTA: 'பிறந்த குழந்தைகளுக்கு தங்க மோதிரம்',
    desc: 'Gold ring gift for every newborn child in Tamil Nadu',
    descTA: 'தமிழ்நாட்டில் பிறக்கும் ஒவ்வொரு குழந்தைக்கும் தங்க மோதிரம்',
    amount: 'Gold Ring', dept: 'Social Welfare Dept', deptTA: 'சமூக நலன் துறை',
    eligible: true, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '👶',
  },

  // ── Governance & Development ─────────────────────────────────────────────
  {
    id: 'G1', category: 'governance',
    name: 'AI-Led Governance', nameTA: 'AI ஆட்சி திட்டம்',
    desc: 'AI Ministry, AI University and digital services to modernise governance',
    descTA: 'ஆட்சியை நவீனப்படுத்த AI அமைச்சரவை, AI பல்கலைக்கழகம் மற்றும் டிஜிட்டல் சேவைகள்',
    amount: 'Policy', dept: 'IT Dept', deptTA: 'தகவல் தொழில்நுட்ப துறை',
    eligible: true, color: TVKColors.purple, bgColor: TVKColors.purpleLight, emoji: '🤖',
  },
  {
    id: 'G2', category: 'governance',
    name: 'Drug-Free Tamil Nadu', nameTA: 'போதைவஸ்து இல்லா தமிழ்நாடு',
    desc: 'Making Tamil Nadu a safe and healthy state, completely free from drugs',
    descTA: 'தமிழ்நாட்டை போதைவஸ்துகளிலிருந்து விடுவித்து பாதுகாப்பான மாநிலமாக மாற்றல்',
    amount: 'Policy Reform', dept: 'Home Dept', deptTA: 'உள்துறை',
    eligible: true, color: TVKColors.error, bgColor: TVKColors.errorLight, emoji: '🚫',
  },
  {
    id: 'G3', category: 'governance',
    name: 'MSME Support Fund', nameTA: 'MSME ஆதரவு நிதி',
    desc: '₹15,000 Crore dedicated support fund for Micro, Small and Medium Enterprises',
    descTA: 'நுண், சிறு மற்றும் நடுத்தர தொழில்களுக்கு ₹15,000 கோடி சிறப்பு ஆதரவு நிதி',
    amount: '₹15,000 Crore', dept: 'Industries Dept', deptTA: 'தொழில் துறை',
    eligible: false, color: TVKColors.accentDark, bgColor: TVKColors.accentLight, emoji: '🏭',
  },
  {
    id: 'G4', category: 'governance',
    name: 'District-Wise Development', nameTA: 'மாவட்ட அடிப்படை வளர்ச்சி',
    desc: 'District-wise planning for balanced and equitable development across Tamil Nadu',
    descTA: 'தமிழ்நாட்டில் சம வளர்ச்சிக்கு மாவட்ட அடிப்படையிலான திட்டமிடல்',
    amount: 'Balanced Growth', dept: 'Planning Dept', deptTA: 'திட்டமிடல் துறை',
    eligible: true, color: TVKColors.success, bgColor: TVKColors.successLight, emoji: '🗺️',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const SchemesScreen: React.FC = () => {
  const [enrolledIds, setEnrolledIds] = useState<string[]>(['S1', 'Y1']);
  const [category,    setCategory]    = useState<SchemeCategory>('all');
  const { strings, language } = useAppLanguage();
  const { mode, theme } = useTheme();

  const isTa          = language === 'ta';
  const enrolledCount = enrolledIds.length;
  const eligibleCount = SCHEMES.filter(s => s.eligible && !enrolledIds.includes(s.id)).length;

  const filteredSchemes = SCHEMES.filter(s =>
    category === 'all' ? true : s.category === category,
  );

  const handleEnroll = (scheme: Scheme) => {
    const name = isTa ? scheme.nameTA : scheme.name;
    Alert.alert(
      strings.schemes.confirmTitle,
      `Enroll in "${name}"?\n\nYou will receive ${scheme.amount}.`,
      [
        { text: strings.schemes.cancel, style: 'cancel' },
        {
          text: strings.schemes.enrollAction,
          onPress: () => {
            setEnrolledIds(prev => [...prev, scheme.id]);
            Alert.alert(
              strings.schemes.successTitle,
              `${strings.schemes.successMessage} ${name}. ${strings.schemes.successTail}`,
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
      label:      isTa ? 'மொத்தம்' : 'Total',
      value:      String(SCHEMES.length),
      bgColor:    mode === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
      valueColor: theme.headerText,
    },
  ];

  // ── Category filter options ──────────────────────────────────────────────
  const filterOptions: FilterOption<SchemeCategory>[] = [
    { value: 'all',        label: strings.schemes.categories.all },
    { value: 'education',  label: strings.schemes.categories.education },
    { value: 'youth',      label: strings.schemes.categories.youth },
    { value: 'farmers',    label: strings.schemes.categories.farmers },
    { value: 'workers',    label: strings.schemes.categories.workers },
    { value: 'women',      label: strings.schemes.categories.women },
    { value: 'governance', label: strings.schemes.categories.governance },
  ];

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader
        title={strings.schemes.title}
        subtitle={strings.schemes.subtitle}
        stats={headerStats}
      />

      {/* Category filter */}
      <FilterBar
        options={filterOptions}
        value={category}
        onChange={setCategory}
        className="mx-4 mt-3 mb-1"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-3 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Promises strip (All tab only) ─────────────────────────── */}
        {category === 'all' && (
          <>
            <SectionTitle
              title={strings.schemes.topPromises}
              className="mb-3"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 4, paddingRight: 4 }}
              className="mb-5"
            >
              {TOP_PROMISES.map(p => (
                <View
                  key={p.id}
                  className="rounded-panel p-3 w-[138px]"
                  style={{
                    backgroundColor: p.bgColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.07,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <Text className="text-[26px] mb-1.5">{p.emoji}</Text>
                  <Text
                    className="text-[13px] font-bold leading-[17px] mb-1.5"
                    style={{ color: p.color }}
                    numberOfLines={3}
                  >
                    {isTa ? p.titleTA : p.title}
                  </Text>
                  <Text className="text-[10px] text-tvk-text-secondary leading-[14px]" numberOfLines={2}>
                    {isTa ? p.detailTA : p.detail}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Section heading ──────────────────────────────────────────── */}
        <SectionTitle
          title={strings.schemes.schemesList}
          className="mb-2"
        />

        {/* ── Vision banner (All tab only) ─────────────────────────────── */}
        {category === 'all' && (
          <View
            className="rounded-panel p-3.5 mb-4 flex-row items-center gap-3"
            style={{ backgroundColor: TVKColors.primaryLight }}
          >
            <Text className="text-[26px]">🎯</Text>
            <View className="flex-1">
              <Text className="text-[13px] font-bold" style={{ color: TVKColors.primary }}>
                {isTa ? 'TVK 2026 கனவு' : 'TVK 2026 Vision'}
              </Text>
              <Text className="text-[11px] text-tvk-text-secondary mt-0.5 leading-[15px]">
                {isTa
                  ? '$1.5 டிரில்லியன் தமிழ்நாடு பொருளாதாரம் — 2036 இல்'
                  : '$1.5 Trillion Tamil Nadu Economy by 2036'}
              </Text>
            </View>
          </View>
        )}

        {/* ── Scheme cards ─────────────────────────────────────────────── */}
        {filteredSchemes.map(scheme => {
          const isEnrolled  = enrolledIds.includes(scheme.id);
          const schemeName  = isTa ? scheme.nameTA  : scheme.name;
          const schemeDesc  = isTa ? scheme.descTA  : scheme.desc;
          const schemeDept  = isTa ? scheme.deptTA  : scheme.dept;

          return (
            <Card key={scheme.id}>
              {/* Icon + name + badge row */}
              <View className="flex-row items-start gap-3 mb-2">
                <View
                  className="w-11 h-11 rounded-panel items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: scheme.bgColor }}
                >
                  <Text className="text-[20px]">{scheme.emoji}</Text>
                </View>

                <View className="flex-1">
                  <Text
                    className="text-[14px] font-semibold text-tvk-text-primary leading-[19px]"
                    numberOfLines={2}
                  >
                    {schemeName}
                  </Text>
                  <Text className="text-[11px] text-tvk-text-secondary mt-0.5">
                    {schemeDept}
                  </Text>
                </View>

                {isEnrolled ? (
                  <Badge label={strings.schemes.enrolled}   variant="success" />
                ) : scheme.eligible ? (
                  <Badge label={strings.schemes.eligible}   variant="warning" />
                ) : (
                  <Badge label={strings.schemes.notEligible} variant="neutral" />
                )}
              </View>

              {/* Description */}
              <Text className="text-[12px] text-tvk-text-secondary leading-[18px] mb-3">
                {schemeDesc}
              </Text>

              {/* Benefit pill */}
              <View
                className="flex-row items-center justify-between rounded-lg px-3 py-2"
                style={{ backgroundColor: scheme.bgColor }}
              >
                <Text className="text-[11px] text-tvk-text-secondary">
                  {isTa ? 'நலன்' : 'Benefit'}
                </Text>
                <Text className="text-[13px] font-bold" style={{ color: scheme.color }}>
                  {scheme.amount}
                </Text>
              </View>

              {/* Enroll button */}
              {!isEnrolled && scheme.eligible && (
                <PrimaryButton
                  label={strings.schemes.enrollNow}
                  onPress={() => handleEnroll(scheme)}
                  variant="outline"
                  color={scheme.color}
                  fullWidth
                  className="mt-3"
                />
              )}
            </Card>
          );
        })}

        {filteredSchemes.length === 0 && (
          <EmptyState message={strings.schemes.empty} />
        )}
      </ScrollView>
    </View>
  );
};

export default SchemesScreen;
