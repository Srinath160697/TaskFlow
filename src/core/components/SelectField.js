import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Chip } from './Chip';

/**
 * Labeled single-select field rendered as a row of chips. Used for small,
 * fixed option sets (priority, status) rather than free text.
 * @param {{ label: string, value: string, options: string[], onChange: (v: string) => void, required?: boolean, colorForOption?: (opt: string) => string, mutedColorForOption?: (opt: string) => string }} props
 */
export function SelectField({ label, value, options, onChange, required = false, colorForOption, mutedColorForOption }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.label, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <View style={[styles.row, { gap: spacing.sm }]}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={value === option}
            onPress={() => onChange(option)}
            color={colorForOption?.(option)}
            mutedColor={mutedColorForOption?.(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
