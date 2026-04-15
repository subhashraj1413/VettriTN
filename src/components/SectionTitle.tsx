import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionTitleProps {
  title: string;
  /** Optional right-side action label */
  action?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Reusable section heading row.
 *
 * ```
 * Quick Access                  Digital Services →
 * ```
 *
 * All styles via NativeWind. No StyleSheet.
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  action,
  onAction,
  className = '',
}) => (
  <View className={`flex-row items-center justify-between mb-4 ${className}`}>
    <Text className="text-[18px] font-bold text-tvk-ink">{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction} activeOpacity={0.8}>
        <Text className="text-[12px] font-medium text-tvk-red">{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default SectionTitle;
