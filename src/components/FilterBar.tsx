import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface FilterBarProps<T extends string = string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Render in a full-width row instead of a scrollable strip */
  fullWidth?: boolean;
  /** Extra className for the outer wrapper */
  className?: string;
}

/**
 * Reusable horizontal filter chip bar.
 *
 * - Scrollable by default (good for many options).
 * - Pass `fullWidth` for a non-scrolling flex row (3–4 options max).
 * - Active chip uses TVK primary colour; inactive uses surface background.
 * - All styles via NativeWind className.
 */
function FilterBar<T extends string = string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className = '',
}: FilterBarProps<T>) {
  const chips = options.map(opt => {
    const active = opt.value === value;
    return (
      <TouchableOpacity
        key={opt.value}
        onPress={() => onChange(opt.value)}
        activeOpacity={0.75}
        className={`
          px-4 py-1.5 rounded-full border
          ${fullWidth ? 'flex-1 items-center' : ''}
          ${active
            ? 'bg-tvk-primary-light border-tvk-primary'
            : 'bg-tvk-background border-tvk-border'}
        `}
      >
        <Text
          className={`text-[12px] leading-[18px] ${active ? 'font-semibold text-tvk-primary' : 'font-medium text-tvk-text-secondary'}`}
        >
          {opt.label}
        </Text>
      </TouchableOpacity>
    );
  });

  if (fullWidth) {
    return (
      <View className={`flex-row gap-2 ${className}`}>
        {chips}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`max-h-12 bg-tvk-surface border-b border-tvk-border ${className}`}
      contentContainerClassName="px-4 py-2 gap-2"
    >
      {chips}
    </ScrollView>
  );
}

export default FilterBar;
