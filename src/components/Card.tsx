import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { TVKColors, spacing, radius } from '../theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  noPadding = false,
  ...rest
}) => {
  const content = (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        {...rest}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: TVKColors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: TVKColors.border,
    marginBottom: spacing.md,
  },
  noPadding: {
    padding: 0,
    overflow: 'hidden',
  },
});

export default Card;
