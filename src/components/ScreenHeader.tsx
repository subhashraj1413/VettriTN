import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerMenuButton from './DrawerMenuButton';
import { useTheme } from '../hooks/useTheme';
import { TVKColors } from '../theme';

interface StatItem {
  label: string;
  value: string;
  valueColor?: string;
  bgColor?: string;
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  stats?: StatItem[];
  bottom?: React.ReactNode;
  className?: string;
}

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
      className={`overflow-hidden rounded-b-[26px] ${className}`}
      style={{ backgroundColor: theme.headerBackground }}
    >
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />

      <View
        className="absolute -left-14 -top-10 h-40 w-40 rounded-full"
        style={{ backgroundColor: TVKColors.primaryDark, opacity: 0.32 }}
      />
      <View
        className="absolute -right-16 top-10 h-44 w-44 rounded-full"
        style={{ backgroundColor: TVKColors.accentDark, opacity: 0.2 }}
      />

      <View className="flex-row h-1">
        <View className="flex-1" style={{ backgroundColor: TVKColors.maroon }} />
        <View className="flex-1" style={{ backgroundColor: TVKColors.yellow }} />
        <View className="flex-1" style={{ backgroundColor: TVKColors.maroon }} />
      </View>

      <View
        className="flex-row items-center gap-3 px-5 pb-4"
        style={{ paddingTop: insets.top + 14 }}
      >
        <DrawerMenuButton color={theme.headerText} backgroundColor={theme.headerChrome} />

        <View className="flex-1">
          <Text className="text-[20px] font-bold leading-7" style={{ color: theme.headerText }}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[13px] leading-5" style={{ color: theme.headerSubText }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {stats && stats.length > 0 && (
        <View className="flex-row gap-3 px-5 pb-4">
          {stats.map(s => (
            <View
              key={s.label}
              className="flex-1 rounded-[14px] border items-center py-2.5"
              style={{
                backgroundColor: s.bgColor ?? theme.headerChrome,
                borderColor: theme.headerSubText,
              }}
            >
              <Text
                className="text-[17px] font-bold leading-6"
                style={{ color: s.valueColor ?? theme.headerText }}
              >
                {s.value}
              </Text>
              <Text
                className="text-[11px] mt-0.5 leading-4"
                style={{ color: s.valueColor ?? theme.headerText, opacity: 0.82 }}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {bottom ? <View className="px-5 pb-5">{bottom}</View> : null}
    </View>
  );
};

export default ScreenHeader;
