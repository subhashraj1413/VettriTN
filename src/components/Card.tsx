import React from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  /** Remove default padding (e.g. for cards with internal sections) */
  noPadding?: boolean;
}

/**
 * Reusable card container.
 * - Uses NativeWind className for all layout/colour styles.
 * - Shadow kept as inline style (cross-platform RN shadow is not in NativeWind preset).
 * - Renders a TouchableOpacity when `onPress` is provided, otherwise a plain View.
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  onPress,
  noPadding = false,
  ...rest
}) => {
  const shadow = {
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  const content = (
    <View
      className={`bg-tvk-surface rounded-panel border border-tvk-border mb-3 ${noPadding ? 'overflow-hidden' : 'p-4'} ${className}`}
      style={[shadow, style]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} {...rest}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Card;
