// ─── CitizenIDScreen ─────────────────────────────────────────────────────────
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DrawerMenuButton from "../components/DrawerMenuButton";
import { useTheme } from "../hooks/useTheme";
import { TVKColors, typography, spacing, radius } from "../theme";
import Card from "../components/Card";
import { useAppLanguage } from "../i18n/LanguageProvider";

export const CitizenIDScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: TVKColors.background }}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.headerBackground}
      />
      <View
        style={[
          idStyles.header,
          {
            paddingTop: insets.top + spacing.md,
            backgroundColor: theme.headerBackground,
          },
        ]}
      >
        <View style={idStyles.headerTopRow}>
          <DrawerMenuButton
            color={theme.headerText}
            backgroundColor={theme.headerChrome}
          />
          <Text style={[idStyles.headerTitle, { color: theme.headerText }]}>
            {strings.citizenId.title}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Front ID Card */}
        <View style={idStyles.card}>
          <View style={idStyles.cardTopRow}>
            <View>
              <Text style={idStyles.govLabel}>GOVERNMENT OF TAMIL NADU</Text>
              <Text style={idStyles.appLabel}>Vettri TN Citizen ID</Text>
            </View>
            <View style={idStyles.verifiedBadge}>
              <Text style={idStyles.verifiedText}>VERIFIED</Text>
            </View>
          </View>
          <View style={idStyles.citizenRow}>
            <View style={idStyles.photoPlaceholder}>
              <Text style={idStyles.photoInitials}>RK</Text>
            </View>
            <View>
              <Text style={idStyles.citizenName}>Subhash</Text>
              <Text style={idStyles.citizenSub}>S/O Thangaraj</Text>
              <Text style={idStyles.citizenSub}>DOB: 15 March 1988</Text>
            </View>
          </View>
          <View style={idStyles.divider} />
          <View style={idStyles.detailGrid}>
            {[
              ["Citizen ID", "TN-2024-087432"],
              ["Constituency", "Perambur"],
              ["District", "Chennai"],
              ["Valid Until", "Dec 2029"],
            ].map(([k, v]) => (
              <View key={k} style={idStyles.detailItem}>
                <Text style={idStyles.detailKey}>{k}</Text>
                <Text style={idStyles.detailValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* QR Code (placeholder) */}
        <Card style={{ alignItems: "center", marginBottom: spacing.md }}>
          <Text
            style={{
              ...typography.caption,
              color: TVKColors.textSecondary,
              marginBottom: spacing.md,
              fontWeight: "500",
            }}
          >
            {strings.citizenId.scanToVerify}
          </Text>
          <View style={idStyles.qrPlaceholder}>
            <Image
              source={require("../assets/qr-placeholder.png")}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <Text
            style={{
              ...typography.caption,
              color: TVKColors.textTertiary,
              marginTop: spacing.sm,
            }}
          >
            TN-2024-087432 · Valid for 24 hours
          </Text>
          <TouchableOpacity
            style={idStyles.refreshBtn}
            onPress={() =>
              Alert.alert(
                strings.citizenId.qrRefreshed,
                strings.citizenId.qrRefreshedMessage,
              )
            }
          >
            <Text style={idStyles.refreshBtnText}>
              🔄 {strings.citizenId.refreshQr}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Linked docs */}
        <Card>
          <Text style={idStyles.linkedTitle}>
            {strings.citizenId.linkedDocuments}
          </Text>
          {[
            ["Aadhaar Card", "**** **** 4821", "success"],
            ["Voter ID", "TN/19/0234/...", "success"],
            ["PAN Card", "ABCPK****F", "info"],
          ].map(([n, num, v]) => (
            <View key={n} style={idStyles.linkedRow}>
              <View>
                <Text
                  style={{ ...typography.body2, color: TVKColors.textPrimary }}
                >
                  {n}
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: TVKColors.textSecondary,
                  }}
                >
                  {num}
                </Text>
              </View>
            </View>
          ))}
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const idStyles = StyleSheet.create({
  header: {
    backgroundColor: TVKColors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTopRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  headerTitle: { ...typography.h4, color: TVKColors.white },
  card: {
    backgroundColor: TVKColors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  govLabel: {
    ...typography.micro,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.8,
  },
  appLabel: {
    ...typography.caption,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  verifiedText: {
    ...typography.micro,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.5,
  },
  citizenRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  photoInitials: {
    ...typography.h3,
    color: TVKColors.white,
    fontWeight: "700",
  },
  citizenName: { ...typography.h4, color: TVKColors.white },
  citizenSub: {
    ...typography.caption,
    color: "rgba(255,255,255,0.7)",
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: spacing.md,
  },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  detailItem: { width: "45%" },
  detailKey: { ...typography.micro, color: "rgba(255,255,255,0.6)" },
  detailValue: {
    ...typography.body2,
    color: TVKColors.white,
    fontWeight: "500",
    marginTop: 2,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: TVKColors.border,
  },
  refreshBtnText: { ...typography.caption, color: TVKColors.primary },
  linkedTitle: {
    ...typography.h5,
    color: TVKColors.textPrimary,
    marginBottom: spacing.md,
  },
  linkedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: TVKColors.border,
  },
});

// ─── ServicesScreen ──────────────────────────────────────────────────────────
export const ServicesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const categories = [
    {
      emoji: "📋",
      label: "Certificates",
      color: TVKColors.primary,
      bg: TVKColors.primaryLight,
    },
    {
      emoji: "🏠",
      label: "Housing",
      color: TVKColors.info,
      bg: TVKColors.infoLight,
    },
    {
      emoji: "💊",
      label: "Health",
      color: TVKColors.success,
      bg: TVKColors.successLight,
    },
    {
      emoji: "🚌",
      label: "Transport",
      color: TVKColors.purple,
      bg: TVKColors.purpleLight,
    },
    {
      emoji: "🎓",
      label: "Education",
      color: TVKColors.accentDark,
      bg: TVKColors.accentLight,
    },
    {
      emoji: "💡",
      label: "Utilities",
      color: TVKColors.error,
      bg: TVKColors.errorLight,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: TVKColors.background }}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.headerBackground}
      />
      <View
        style={[
          svcStyles.header,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: theme.headerBackground,
          },
        ]}
      >
        <View style={svcStyles.headerTopRow}>
          <DrawerMenuButton
            color={theme.headerText}
            backgroundColor={theme.headerChrome}
          />
          <View style={{ flex: 1 }}>
            <Text style={[svcStyles.headerTitle, { color: theme.headerText }]}>
              {strings.services.title}
            </Text>
            <Text style={[svcStyles.headerSub, { color: theme.headerSubText }]}>
              {strings.services.subtitle}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={svcStyles.sectionTitle}>
          {strings.services.selectCategory}
        </Text>
        <View style={svcStyles.grid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={[svcStyles.catCard, { backgroundColor: c.bg }]}
              onPress={() =>
                Alert.alert(c.label, `Starting ${c.label} service request...`)
              }
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 28 }}>{c.emoji}</Text>
              <Text style={[svcStyles.catLabel, { color: c.color }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={svcStyles.sectionTitle}>
          {strings.services.recentRequests}
        </Text>
        {[
          {
            title: "Income Certificate",
            cat: "Certificates",
            status: "Under Review",
            date: "Today",
            emoji: "📋",
            statusColor: TVKColors.warning,
          },
          {
            title: "Property Tax",
            cat: "Utilities",
            status: "Completed",
            date: "1 week ago",
            emoji: "💡",
            statusColor: TVKColors.success,
          },
        ].map((r, i) => (
          <Card
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              marginBottom: spacing.sm,
            }}
          >
            <Text style={{ fontSize: 24 }}>{r.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.h5, color: TVKColors.textPrimary }}>
                {r.title}
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: TVKColors.textSecondary,
                }}
              >
                {r.cat} · {r.date}
              </Text>
            </View>
            <Text
              style={{
                ...typography.caption,
                color: r.statusColor,
                fontWeight: "600",
              }}
            >
              {r.status}
            </Text>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const svcStyles = StyleSheet.create({
  header: {
    backgroundColor: TVKColors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerTitle: { ...typography.h4, color: TVKColors.white },
  headerSub: {
    ...typography.caption,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.h5,
    color: TVKColors.textSecondary,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  catCard: {
    width: "47%",
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  catLabel: { ...typography.h5, textAlign: "center" },
});

// ─── ProfileScreen ────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const sections = [
    {
      title: strings.profile.personalInformation,
      rows: [
        ["Full Name", "Subhash"],
        ["Date of Birth", "15 March 1988"],
        ["Gender", "Male"],
        ["Mobile", "+91 98*** ***21"],
        ["Email", "subhash@gmail.com"],
      ],
    },
    {
      title: strings.profile.address,
      rows: [
        ["Street", "12A, Gandhi Nagar"],
        ["Area", "Perambur, Chennai"],
        ["District", "Chennai"],
        ["PIN Code", "600011"],
      ],
    },
    {
      title: strings.profile.civicInformation,
      rows: [
        ["Constituency", "Perambur"],
        ["Voter ID", "TN/19/0234/..."],
        ["Ward", "Ward 72, Zone 3"],
        ["Ration Card", "Linked & Verified"],
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: TVKColors.background }}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.headerBackground}
      />
      <View
        style={[
          profStyles.header,
          {
            paddingTop: insets.top + spacing.xl,
            backgroundColor: theme.headerBackground,
          },
        ]}
      >
        <View style={profStyles.headerTopRow}>
          <DrawerMenuButton
            color={theme.headerText}
            backgroundColor={theme.headerChrome}
          />
        </View>
        <View style={profStyles.avatar}>
          <Text style={profStyles.avatarText}>RK</Text>
        </View>
        <Text style={[profStyles.name, { color: theme.headerText }]}>
          Subhash
        </Text>
        <Text style={[profStyles.sub, { color: theme.headerSubText }]}>
          TN-2024-087432 · {strings.profile.verifiedCitizen}
        </Text>
        <View style={profStyles.flagStrip}>
          {[TVKColors.maroon, TVKColors.yellow, TVKColors.maroon].map(
            (c, i) => (
              <View
                key={i}
                style={[profStyles.flagBand, { backgroundColor: c }]}
              />
            ),
          )}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {sections.map((s) => (
          <Card key={s.title} style={{ marginBottom: spacing.md }}>
            <Text style={profStyles.sectionTitle}>{s.title}</Text>
            {s.rows.map(([k, v]) => (
              <View key={k} style={profStyles.row}>
                <Text style={profStyles.rowKey}>{k}</Text>
                <Text style={profStyles.rowVal}>{v}</Text>
              </View>
            ))}
          </Card>
        ))}
        <TouchableOpacity
          style={profStyles.signOut}
          onPress={() => Alert.alert(strings.profile.signOut, "Are you sure?")}
        >
          <Text style={profStyles.signOutText}>{strings.profile.signOut}</Text>
        </TouchableOpacity>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const profStyles = StyleSheet.create({
  header: {
    backgroundColor: TVKColors.primary,
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  headerTopRow: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
    alignItems: "flex-start",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: TVKColors.yellow,
    marginBottom: spacing.md,
  },
  avatarText: { ...typography.h2, color: TVKColors.white, fontWeight: "700" },
  name: { ...typography.h3, color: TVKColors.white },
  sub: { ...typography.caption, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  flagStrip: {
    flexDirection: "row",
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  flagBand: { flex: 1 },
  sectionTitle: {
    ...typography.caption,
    color: TVKColors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: TVKColors.border,
  },
  rowKey: { ...typography.body2, color: TVKColors.textSecondary },
  rowVal: {
    ...typography.body2,
    color: TVKColors.textPrimary,
    fontWeight: "500",
  },
  signOut: {
    borderWidth: 0.5,
    borderColor: TVKColors.error,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  signOutText: { ...typography.h5, color: TVKColors.error },
});
