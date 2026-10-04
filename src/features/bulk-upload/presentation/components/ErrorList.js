import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';

/**
 * Shows row-level problems (validation errors or duplicates) with the row
 * number and reason.
 * @param {{ title: string, items: Array<{row: number, reason: string}>, tone?: 'danger'|'warning' }} props
 */
export function ErrorList({ title, items, tone = 'danger' }) {
  const { colors, spacing, typography } = useTheme();
  if (items.length === 0) return null;
  const accent = tone === 'warning' ? colors.warning : colors.danger;

  return (
    <Card style={{ marginTop: spacing.md }}>
      <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
        {title} ({items.length})
      </Text>
      {items.map((item, index) => (
        <View key={`${item.row}-${index}`} style={[styles.row, { marginBottom: spacing.xs }]}>
          <Text style={[typography.captionBold, { color: accent }]}>
            {item.row > 0 ? `Row ${item.row}` : 'File'}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, flex: 1, marginLeft: spacing.sm }]}>
            {item.reason}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
