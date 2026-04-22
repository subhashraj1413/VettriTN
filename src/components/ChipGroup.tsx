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
  wrap?: boolean;
  className?: string;
}

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
        <Text className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-tvk-text-secondary">
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
              activeOpacity={0.8}
              className={`
                rounded-full border px-3 py-1.5
                ${active
                  ? 'border-tvk-accent bg-tvk-accent-light'
                  : 'border-tvk-border bg-tvk-surface'}
              `}
            >
              <Text
                className={`text-[12px] leading-[18px] ${
                  active ? 'font-semibold text-tvk-accent-dark' : 'text-tvk-text-secondary'
                }`}
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
