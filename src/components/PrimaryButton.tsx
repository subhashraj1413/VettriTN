import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { TVKColors } from '../theme';

type Variant = 'filled' | 'outline' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Dynamic accent color — falls back to TVK primary */
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

/**
 * Reusable primary action button.
 * - NativeWind className drives layout, size, and opacity.
 * - Dynamic `color` prop handled via inline style (can't be known at build time).
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'filled',
  color = TVKColors.primary,
  disabled = false,
  loading = false,
  className = '',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isFilled  = variant === 'filled';
  const isOutline = variant === 'outline';

  const dynamicBtnStyle: ViewStyle = {
    ...(isFilled  && { backgroundColor: color }),
    ...(isOutline && { borderColor: color, borderWidth: 1.5 }),
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
  };

  const textColor = isFilled
    ? TVKColors.white
    : isOutline
      ? color
      : color; // ghost

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`
        items-center justify-center min-h-[46px] rounded-panel py-3 px-6
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className}
      `}
      style={[dynamicBtnStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? TVKColors.white : color} size="small" />
      ) : (
        <Text
          className="text-[15px] font-semibold leading-5"
          style={[{ color: textColor }, textStyle]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
