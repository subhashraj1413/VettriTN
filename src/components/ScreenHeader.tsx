import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerMenuButton from './DrawerMenuButton';
import { useTheme } from '../hooks/useTheme';

interface StatItem {
  label: string;
  value: string;
  /** Optional override for value text color */
  valueColor?: string;
  /** Optional background for the chip */
  bgColor?: string;
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional stats row shown at the bottom of the header */
  stats?: StatItem[];
  /** Optional slot for tabs/filter pills rendered below title row */
  bottom?: React.ReactNode;
  /** Additional className for the outer header container */
  className?: string;
}

/**
 * Reusable screen header used across all protected screens.
 *
 * Renders:
 *   ┌─ [flag stripe] ──────────────────────────────────┐
 *   │  [DrawerMenuButton]  [title / subtitle]           │
 *   │  [stats row (optional)]                           │
 *   │  [bottom slot (tabs, filters, etc.)]              │
 *   └───────────────────────────────────────────────────┘
 *
 * Dynamic theming (dark / light) handled via `useTheme`.
 * Layout + spacing purely via NativeWind className.
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  stats,
  bottom,
  className = '',
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      className={`rounded-b-[10px] ${className}`}
      style={{ backgroundColor: theme.headerBackground }}
    >
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.headerBackground}
      />

      {/* TVK flag stripe */}
      <View className="flex-row h-1">
        <View className="flex-1" style={{ backgroundColor: theme.headerText }} />
        <View className="flex-1" style={{ backgroundColor: theme.headerBackground }} />
        <View className="flex-1" style={{ backgroundColor: theme.headerText }} />
      </View>

      {/* Title row */}
      <View
        className="flex-row items-center gap-3 px-5 pb-4"
        style={{ paddingTop: insets.top + 14 }}
      >
        <DrawerMenuButton
          color={theme.headerText}
          backgroundColor={theme.headerChrome}
        />
        <View className="flex-1">
          <Text
            className="text-[18px] font-bold leading-6"
            style={{ color: theme.headerText }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="text-[13px] mt-0.5 leading-5"
              style={{ color: theme.headerSubText }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Stats row */}
      {stats && stats.length > 0 && (
        <View className="flex-row gap-3 px-5 pb-4">
          {stats.map(s => (
            <View
              key={s.label}
              className="flex-1 rounded-panel items-center py-2"
              style={{ backgroundColor: s.bgColor ?? 'rgba(255,255,255,0.2)' }}
            >
              <Text
                className="text-[17px] font-bold leading-6"
                style={{ color: s.valueColor ?? theme.headerText }}
              >
                {s.value}
              </Text>
              <Text
                className="text-[11px] mt-0.5 leading-4"
                style={{ color: s.valueColor ?? theme.headerText, opacity: 0.8 }}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Bottom slot (tabs, pills, etc.) */}
      {bottom && (
        <View className="px-5 pb-4">
          {bottom}
        </View>
      )}
    </View>
  );
};

export default ScreenHeader;
