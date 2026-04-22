import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityItemProps {
  title: string;
  subtitle: string;
  time: string;
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Accent colour for icon background tint and icon itself */
  color: string;
  className?: string;
}

const SHADOW = {
  shadowColor: '#740000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 2,
} as const;

/**
 * Reusable activity / timeline row card.
 * Used in HomeScreen's "Recent Activity" section.
 * All layout via NativeWind; dynamic `color` via inline style.
 */
const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  subtitle,
  time,
  icon,
  color,
  className = '',
}) => (
  <View
    className={`flex-row rounded-panel border border-tvk-border bg-white p-4 mb-3 ${className}`}
    style={SHADOW}
  >
    {/* Icon badge */}
    <View
      className="w-11 h-11 items-center justify-center rounded-panel mr-3 flex-shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <Ionicons name={icon} size={19} color={color} />
    </View>

    {/* Content */}
    <View className="flex-1">
      <View className="flex-row items-start justify-between">
        <Text className="flex-1 mr-3 text-[15px] font-semibold text-tvk-ink" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-[11px] font-medium text-tvk-muted">{time}</Text>
      </View>
      <Text className="mt-1 text-[13px] leading-[18px] text-tvk-muted" numberOfLines={2}>
        {subtitle}
      </Text>
    </View>
  </View>
);

export default ActivityItem;
