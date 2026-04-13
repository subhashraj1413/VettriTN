/**
 * Vettri TN — Splash Screen
 * TVK official colors: Maroon-Red (#C41E3A) + Golden Yellow (#F5C518)
 *
 * Shows animated logo on TVK red background.
 * Navigates to Main after 2.5s.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { TVKColors, typography, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale    = useRef(new Animated.Value(0.4)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const barWidth     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(TVKColors.primary);
    }

    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue:       1,
          tension:       80,
          friction:      7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue:         1,
          duration:        500,
          useNativeDriver: true,
        }),
      ]),
      // App name fades in
      Animated.timing(textOpacity, {
        toValue:         1,
        duration:        400,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(tagOpacity, {
        toValue:         1,
        duration:        400,
        useNativeDriver: true,
      }),
      // Progress bar fills
      Animated.timing(barWidth, {
        toValue:         width * 0.5,
        duration:        800,
        useNativeDriver: false,  // width animation needs JS driver
      }),
    ]).start(() => {
      setTimeout(onFinish, 200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={TVKColors.primary} />

      {/* Background accent circles */}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />

      {/* Logo mark */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Outer ring — TVK Yellow */}
        <View style={styles.logoOuter}>
          {/* Inner circle — White */}
          <View style={styles.logoInner}>
            <Text style={styles.logoInitials}>VTN</Text>
          </View>
        </View>

        {/* Yellow dot accents — represent the Vaagai flower */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={[
              styles.petal,
              {
                transform: [
                  { rotate: `${i * 60}deg` },
                  { translateY: -52 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 28 }}>
        <Text style={styles.appName}>Vettri TN</Text>
        <View style={styles.titleDivider} />
        <Text style={styles.appNameTamil}>வெற்றி தமிழ்நாடு</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Citizen Super App
      </Animated.Text>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Loading bar */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>

        {/* TVK party attribution */}
        <Animated.Text style={[styles.attribution, { opacity: tagOpacity }]}>
          Powered by TVK Vision for Digital Tamil Nadu
        </Animated.Text>

        {/* Party flag colors strip */}
        <View style={styles.flagStrip}>
          <View style={[styles.flagBand, { backgroundColor: TVKColors.maroon }]} />
          <View style={[styles.flagBand, { backgroundColor: TVKColors.yellow }]} />
          <View style={[styles.flagBand, { backgroundColor: TVKColors.maroon }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: TVKColors.primary,  // TVK Red
    alignItems:      'center',
    justifyContent:  'center',
  },

  // Background decorative circles
  circle: {
    position:        'absolute',
    width:           300,
    height:          300,
    borderRadius:    150,
    backgroundColor: TVKColors.primaryDark,
    opacity:         0.3,
  },
  circleTopRight: {
    top:  -80,
    right: -80,
  },
  circleBottomLeft: {
    bottom: -100,
    left:   -80,
  },

  // Logo
  logoWrapper: {
    width:           120,
    height:          120,
    alignItems:      'center',
    justifyContent:  'center',
  },
  logoOuter: {
    width:           110,
    height:          110,
    borderRadius:    55,
    backgroundColor: TVKColors.yellow,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     3,
    borderColor:     'rgba(255,255,255,0.3)',
  },
  logoInner: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: TVKColors.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  logoInitials: {
    ...typography.h2,
    color:       TVKColors.yellow,
    fontWeight:  '800',
    letterSpacing: 2,
  },
  petal: {
    position:        'absolute',
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: TVKColors.yellow,
    top:             55,
    left:            55,
  },

  // Text
  appName: {
    ...typography.h1,
    color:       TVKColors.white,
    fontWeight:  '700',
    letterSpacing: 1.5,
  },
  appNameTamil: {
    ...typography.body2,
    color:       TVKColors.yellow,
    letterSpacing: 1,
    marginTop:   4,
  },
  titleDivider: {
    width:           40,
    height:          2,
    backgroundColor: TVKColors.yellow,
    borderRadius:    1,
    marginVertical:  8,
  },
  tagline: {
    ...typography.body2,
    color:       'rgba(255,255,255,0.75)',
    marginTop:   spacing.sm,
    letterSpacing: 0.8,
  },

  // Bottom
  bottomSection: {
    position: 'absolute',
    bottom:   48,
    width:    '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  barTrack: {
    width:           width * 0.5,
    height:          3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius:    2,
    overflow:        'hidden',
    marginBottom:    spacing.lg,
  },
  barFill: {
    height:          3,
    backgroundColor: TVKColors.yellow,
    borderRadius:    2,
  },
  attribution: {
    ...typography.caption,
    color:       'rgba(255,255,255,0.55)',
    marginBottom: spacing.lg,
    textAlign:   'center',
  },
  flagStrip: {
    flexDirection: 'row',
    width:         80,
    height:        8,
    borderRadius:  4,
    overflow:      'hidden',
  },
  flagBand: {
    flex: 1,
  },
});

export default SplashScreen;
