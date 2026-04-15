import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { TVKColors } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  className?: string;
  /** Pass `multiline` + `numberOfLines` for textarea behaviour */
}

/**
 * Reusable labelled form input.
 * Label style, input background, border, and padding all via NativeWind.
 * Placeholder colour still requires inline style (RN limitation).
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  className = '',
  multiline,
  numberOfLines,
  style,
  ...rest
}) => (
  <View className={`mb-3 ${className}`}>
    <Text className="text-[11px] font-semibold uppercase tracking-wide text-tvk-text-secondary mb-2 mt-3">
      {label}
    </Text>
    <TextInput
      placeholderTextColor={TVKColors.textTertiary}
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`
        bg-tvk-background rounded-panel border border-tvk-border
        px-3 py-3 text-[14px] text-tvk-text-primary
        ${multiline ? 'min-h-[100px]' : ''}
      `}
      style={[
        multiline && { textAlignVertical: 'top' },
        style,
      ]}
      {...rest}
    />
  </View>
);

export default FormField;
