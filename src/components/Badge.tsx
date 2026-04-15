import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'purple'
  | 'primary'
  | 'accent'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Maps each variant to NativeWind className pairs (bg + text).
 * All color tokens are defined in tailwind.config.js under `tvk.*`.
 */
const VARIANT_CLASSES: Record<BadgeVariant, { wrap: string; text: string }> = {
  success: { wrap: 'bg-tvk-success-light border-tvk-success/20',  text: 'text-tvk-success' },
  warning: { wrap: 'bg-tvk-warning-light border-tvk-warning/20',  text: 'text-tvk-warning' },
  error:   { wrap: 'bg-tvk-error-light border-tvk-error/20',      text: 'text-tvk-error' },
  info:    { wrap: 'bg-tvk-info-light border-tvk-info/20',        text: 'text-tvk-info' },
  purple:  { wrap: 'bg-tvk-purple-light border-tvk-purple/20',    text: 'text-tvk-purple' },
  primary: { wrap: 'bg-tvk-primary-light border-tvk-primary/20',  text: 'text-tvk-primary-dark' },
  accent:  { wrap: 'bg-tvk-accent-light border-tvk-accent/20',    text: 'text-tvk-accent-dark' },
  neutral: { wrap: 'bg-tvk-surface-alt border-tvk-border',        text: 'text-tvk-text-secondary' },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  className = '',
  style,
  textStyle,
}) => {
  const { wrap, text } = VARIANT_CLASSES[variant];

  return (
    <View
      className={`px-2.5 py-1 rounded-full self-start border ${wrap} ${className}`}
      style={style}
    >
      <Text
        className={`text-[11px] font-medium leading-4 ${text}`}
        style={textStyle}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
