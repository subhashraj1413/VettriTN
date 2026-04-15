import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authActions } from "../../features/auth/store/auth.store";
import { useAppLanguage } from "../../i18n/LanguageProvider";
import { writeSession } from "../../lib/storage/preferencesStorage";
import { useAppDispatch } from "../../lib/store";
import { useTheme } from "../../hooks/useTheme";
import { TVKColors } from "../../theme";

export default function LoginScreen() {
  const { strings } = useAppLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("subhash@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(strings.auth.requiredTitle, strings.auth.requiredMessage);
      return;
    }

    setLoading(true);

    const session = {
      token: `token-${Date.now()}`,
      user: {
        id: "TN-USER-001",
        name: "Subhash",
        email: email.trim(),
      },
    };

    try {
      await writeSession(session);
      dispatch(authActions.setSession(session));
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      <View
        style={{
          backgroundColor: theme.headerBackground,
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                color: theme.headerSubText,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {strings.auth.badge}
            </Text>
            <Text
              style={{
                color: theme.headerText,
                fontSize: 28,
                fontWeight: "800",
                marginTop: 10,
              }}
            >
              {strings.auth.title}
            </Text>
            <Text
              style={{
                color: theme.headerSubText,
                fontSize: 13,
                marginTop: 6,
              }}
            >
              {strings.auth.subtitle}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20, marginTop: -10 }}>
        <Image
          source={require("../../assets/login-form-img-yellow.png")}
          style={{ width: "100%", height: 280, resizeMode: "contain" }}
        />
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: theme.secondaryText,
              fontSize: 12,
              marginBottom: 6,
            }}
          >
            {strings.auth.email}
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder={strings.auth.emailPlaceholder}
            placeholderTextColor={theme.secondaryText}
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.primaryText,
              marginBottom: 14,
            }}
            value={email}
          />

          <Text
            style={{
              color: theme.secondaryText,
              fontSize: 12,
              marginBottom: 6,
            }}
          >
            {strings.auth.password}
          </Text>
          <TextInput
            onChangeText={setPassword}
            placeholder={strings.auth.passwordPlaceholder}
            placeholderTextColor={theme.secondaryText}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.primaryText,
            }}
            value={password}
          />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              void handleLogin();
            }}
            style={{
              marginTop: 16,
              backgroundColor: TVKColors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                color: TVKColors.white,
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              {loading ? strings.auth.signingIn : strings.auth.login}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
