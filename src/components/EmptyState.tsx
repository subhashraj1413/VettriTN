import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  emoji?: string;
  message: string;
  className?: string;
}

/**
 * Reusable empty-list placeholder.
 * All styles via NativeWind.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '🔍',
  message,
  className = '',
}) => (
  <View className={`items-center pt-16 ${className}`}>
    <Text className="text-[32px] mb-4">{emoji}</Text>
    <Text className="text-[14px] text-tvk-text-tertiary text-center leading-6">
      {message}
    </Text>
  </View>
);

export default EmptyState;
