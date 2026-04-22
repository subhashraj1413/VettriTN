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
  fullWidth?: boolean;
  className?: string;
}

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
        activeOpacity={0.8}
        className={`
          rounded-full border px-4 py-1.5
          ${fullWidth ? 'flex-1 items-center' : ''}
          ${active
            ? 'border-tvk-accent bg-tvk-accent-light'
            : 'border-tvk-border bg-tvk-surface'}
        `}
      >
        <Text
          className={`text-[12px] leading-[18px] ${
            active ? 'font-semibold text-tvk-accent-dark' : 'font-medium text-tvk-text-secondary'
          }`}
        >
          {opt.label}
        </Text>
      </TouchableOpacity>
    );
  });

  if (fullWidth) {
    return <View className={`flex-row gap-2 ${className}`}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`max-h-12 border-b border-tvk-border bg-tvk-surface ${className}`}
      contentContainerClassName="gap-2 px-4 py-2"
    >
      {chips}
    </ScrollView>
  );
}

export default FilterBar;
