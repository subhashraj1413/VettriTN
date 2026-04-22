/**
 * Vettri TN — Splash Screen
 * Modern launch look using TVK Yellow + Red.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { TVKColors, typography, spacing } from '../theme';

const { width } = Dimensions.get('window');

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
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(TVKColors.yellowLight);
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
      <StatusBar barStyle="dark-content" backgroundColor={TVKColors.yellowLight} />

      {/* Background accent circles */}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />

      {/* TN Logo */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoHalo} />
        <Image
          source={require('../assets/TN-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
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
    backgroundColor: TVKColors.yellowLight,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // Background decorative circles
  circle: {
    position:        'absolute',
    width:           280,
    height:          280,
    borderRadius:    140,
    backgroundColor: TVKColors.primary,
    opacity:         0.12,
  },
  circleTopRight: {
    top:  -70,
    right: -70,
  },
  circleBottomLeft: {
    bottom: -90,
    left:   -75,
  },

  // Logo
  logoWrapper: {
    width:           160,
    height:          160,
    borderRadius:    80,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: TVKColors.white,
    borderWidth:     1,
    borderColor:     `${TVKColors.primary}33`,
    shadowColor:     TVKColors.redDark,
    shadowOffset:    { width: 0, height: 10 },
    shadowOpacity:   0.14,
    shadowRadius:    18,
    elevation:       4,
  },
  logoHalo: {
    position:        'absolute',
    width:           126,
    height:          126,
    borderRadius:    63,
    backgroundColor: `${TVKColors.yellow}52`,
  },
  logoImage: {
    width:  120,
    height: 120,
  },

  // Text
  appName: {
    ...typography.h1,
    color:       TVKColors.primary,
    fontWeight:  '700',
    letterSpacing: 1.5,
  },
  appNameTamil: {
    ...typography.body2,
    color:       TVKColors.textOnYellow,
    letterSpacing: 1,
    marginTop:   4,
  },
  titleDivider: {
    width:           40,
    height:          2,
    backgroundColor: TVKColors.primary,
    borderRadius:    1,
    marginVertical:  8,
  },
  tagline: {
    ...typography.body2,
    color:       TVKColors.textOnYellow,
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
    backgroundColor: 'rgba(93,69,0,0.16)',
    borderRadius:    2,
    overflow:        'hidden',
    marginBottom:    spacing.lg,
  },
  barFill: {
    height:          3,
    backgroundColor: TVKColors.primary,
    borderRadius:    2,
  },
  attribution: {
    ...typography.caption,
    color:       'rgba(93,69,0,0.88)',
    marginBottom: spacing.lg,
    textAlign:   'center',
  },
  flagStrip: {
    flexDirection: 'row',
    width:         88,
    height:        9,
    borderRadius:  4,
    overflow:      'hidden',
  },
  flagBand: {
    flex: 1,
  },
});

export default SplashScreen;
