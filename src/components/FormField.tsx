import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { TVKColors } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  className?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  className = '',
  required = false,
  helperText,
  errorText,
  multiline,
  numberOfLines,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorText);

  const fieldLabel = useMemo(() => {
    const cleaned = label.replace(' *', '').trim();
    return required ? `${cleaned} *` : label;
  }, [label, required]);

  const borderColor = hasError
    ? TVKColors.error
    : focused
      ? TVKColors.primary
      : TVKColors.border;

  const shadowStyle = {
    shadowColor: TVKColors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: focused ? 0.16 : 0.08,
    shadowRadius: focused ? 10 : 7,
    elevation: focused ? 3 : 1,
  } as const;

  return (
    <View className={`mb-4 ${className}`}>
      <Text
        className="mb-2 text-[12px] font-semibold tracking-[0.3px]"
        style={{ color: hasError ? TVKColors.error : TVKColors.textSecondary }}
        accessibilityRole="text"
      >
        {fieldLabel}
      </Text>

      <TextInput
        placeholderTextColor={TVKColors.textTertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        accessibilityLabel={accessibilityLabel ?? label.replace(' *', '').trim()}
        accessibilityHint={hasError ? errorText : helperText}
        className={`
          rounded-[16px] border bg-tvk-surface px-4 py-3.5 text-[15px] leading-5 text-tvk-text-primary
          ${multiline ? 'min-h-[112px]' : ''}
        `}
        style={[
          { borderColor },
          shadowStyle,
          multiline && { textAlignVertical: 'top' },
          style,
        ]}
        {...rest}
      />

      {hasError ? (
        <Text className="mt-2 text-[11px] font-medium" style={{ color: TVKColors.error }}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text className="mt-2 text-[11px]" style={{ color: TVKColors.textTertiary }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

export default FormField;
