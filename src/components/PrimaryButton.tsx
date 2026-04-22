import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

type Variant = 'filled' | 'outline' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'filled',
  color,
  disabled = false,
  loading = false,
  className = '',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useTheme();
  const isFilled = variant === 'filled';
  const isOutline = variant === 'outline';
  const resolvedColor = color ?? theme.accent;

  const dynamicBtnStyle: ViewStyle = {
    ...(isFilled && {
      backgroundColor: resolvedColor,
      borderColor: theme.headerBackground,
      borderWidth: 1,
    }),
    ...(isOutline && {
      borderColor: resolvedColor,
      borderWidth: 1.5,
      backgroundColor: theme.surface,
    }),
    shadowColor: theme.headerBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 2,
  };

  const textColor = isFilled ? theme.onAccent : resolvedColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className={`
        min-h-[48px] items-center justify-center rounded-[14px] px-6 py-3
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className}
      `}
      style={[dynamicBtnStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? theme.onAccent : resolvedColor} size="small" />
      ) : (
        <Text className="text-[15px] font-semibold leading-5" style={[{ color: textColor }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
