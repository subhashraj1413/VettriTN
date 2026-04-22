import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { useAppLanguage } from '../../i18n/LanguageProvider';
import { writeSession } from '../../lib/storage/preferencesStorage';
import { useAppDispatch } from '../../lib/store';
import { authActions } from '../../features/auth/store/auth.store';
import { TVKColors } from '../../theme';

export default function LoginScreen() {
  const { strings } = useAppLanguage();
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('tksubhashraj14@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const isModern = mode === 'modern';

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(strings.auth.requiredTitle, strings.auth.requiredMessage);
      return;
    }

    setLoading(true);

    const session = {
      token: `token-${Date.now()}`,
      user: {
        id: 'TN-USER-001',
        name: 'Subhash',
        email: email.trim(),
      },
    };

    try {
      await writeSession(session);
      dispatch(authActions.setSession(session));
      router.replace('/');
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
          paddingBottom: 18,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 190,
            height: 190,
            borderRadius: 95,
            right: -52,
            top: -46,
            backgroundColor: 'rgba(255,255,255,0.14)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 145,
            height: 145,
            borderRadius: 72,
            left: -38,
            bottom: -58,
            backgroundColor: 'rgba(245,197,24,0.26)',
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: theme.headerSubText, fontSize: 12, fontWeight: '700' }}>
              {strings.auth.badge}
            </Text>
            <Text style={{ color: theme.headerText, fontSize: 28, fontWeight: '800', marginTop: 10 }}>
              {strings.auth.title}
            </Text>
            <Text style={{ color: theme.headerSubText, fontSize: 13, marginTop: 6 }}>
              {strings.auth.subtitle}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 14,
          paddingBottom: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={
            isModern
              ? require('../../assets/login-form-img-yellow.png')
              : require('../../assets/login-form-img-red.png')
          }
          style={{ width: '100%', height: 260, resizeMode: 'contain' }}
        />

        <View
          style={{
            marginTop: 4,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: TVKColors.border,
            backgroundColor: TVKColors.surface,
            paddingHorizontal: 16,
            paddingVertical: 14,
            shadowColor: TVKColors.maroon,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          <FormField
            label={strings.auth.email}
            value={email}
            onChangeText={setEmail}
            placeholder={strings.auth.emailPlaceholder}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            autoComplete="email"
            required
          />

          <FormField
            label={strings.auth.password}
            value={password}
            onChangeText={setPassword}
            placeholder={strings.auth.passwordPlaceholder}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            required
            className="mb-2"
          />

          <PrimaryButton
            label={loading ? strings.auth.signingIn : strings.auth.login}
            onPress={() => {
              void handleLogin();
            }}
            loading={loading}
            fullWidth
            className="mt-2"
          />
        </View>
      </ScrollView>
    </View>
  );
}
