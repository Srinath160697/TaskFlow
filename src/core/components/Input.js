import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Labeled text input with an optional inline error message.
 * @param {{ label: string, value: string, onChangeText: (t: string) => void, error?: string, placeholder?: string, multiline?: boolean, maxLength?: number, required?: boolean }} props
 */
export function Input({ label, value, onChangeText, error, placeholder, multiline = false, maxLength, required = false }) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.label, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        maxLength={maxLength}
        style={[
          typography.body,
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
            minHeight: multiline ? 90 : 44,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.xs }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
