import React from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  onPress,
  noPadding = false,
  ...rest
}) => {
  const { theme } = useTheme();

  const shadow = {
    shadowColor: theme.headerBackground,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  } as const;

  const content = (
    <View
      className={`mb-3 rounded-[18px] border ${noPadding ? 'overflow-hidden' : 'p-4'} ${className}`}
      style={[shadow, { borderColor: theme.border, backgroundColor: theme.card }, style]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} {...rest}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Card;
