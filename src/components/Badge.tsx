import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TVKColors, typography, radius } from '../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'purple' | 'primary' | 'accent' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success:  { bg: TVKColors.successLight, text: TVKColors.success },
  warning:  { bg: TVKColors.warningLight, text: TVKColors.warning },
  error:    { bg: TVKColors.errorLight,   text: TVKColors.error },
  info:     { bg: TVKColors.infoLight,    text: TVKColors.info },
  purple:   { bg: TVKColors.purpleLight,  text: TVKColors.purple },
  primary:  { bg: TVKColors.primaryLight, text: TVKColors.primaryDark },
  accent:   { bg: TVKColors.accentLight,  text: TVKColors.accentDark },
  neutral:  { bg: TVKColors.surfaceAlt,   text: TVKColors.textSecondary },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
  textStyle,
}) => {
  const { bg, text } = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[typography.label, styles.text, { color: text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  text: {
    letterSpacing: 0,
  },
});

export default Badge;
