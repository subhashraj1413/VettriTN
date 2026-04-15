import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ChipOption<T extends string = string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string = string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  /** Wrap chips across multiple lines */
  wrap?: boolean;
  className?: string;
}

/**
 * Reusable chip selector group (single-select).
 *
 * Used for: category picker, priority selector, filter pills.
 * All layout + colours via NativeWind className.
 */
function ChipGroup<T extends string = string>({
  options,
  value,
  onChange,
  label,
  wrap = false,
  className = '',
}: ChipGroupProps<T>) {
  return (
    <View className={className}>
      {label ? (
        <Text className="text-[11px] font-semibold uppercase tracking-wide text-tvk-text-secondary mb-2">
          {label}
        </Text>
      ) : null}

      <View className={`flex-row gap-2 ${wrap ? 'flex-wrap' : ''}`}>
        {options.map(opt => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.75}
              className={`
                px-3 py-1.5 rounded-full border
                ${active
                  ? 'bg-tvk-primary-light border-tvk-primary'
                  : 'bg-tvk-background border-tvk-border'}
              `}
            >
              <Text
                className={`text-[12px] leading-[18px] ${active ? 'font-semibold text-tvk-primary' : 'text-tvk-text-secondary'}`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default ChipGroup;
