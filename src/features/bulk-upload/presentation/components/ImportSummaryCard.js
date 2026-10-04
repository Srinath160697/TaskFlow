import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';

/**
 * Shows the totals from a finished bulk import: total rows, imported,
 * invalid, and duplicates skipped.
 * @param {{ summary: import('../../domain/bulkImportUseCase').BulkImportSummary }} props
 */
export function ImportSummaryCard({ summary }) {
  const { colors, spacing, typography } = useTheme();
  const rows = [
    { label: 'Total rows', value: summary.totalRows },
    { label: 'Imported', value: summary.imported, color: colors.success },
    { label: 'Invalid', value: summary.invalid, color: colors.danger },
    { label: 'Duplicates skipped', value: summary.duplicatesSkipped, color: colors.warning },
  ];

  return (
    <Card>
      <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>Import summary</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={[typography.body, { color: colors.textMuted }]}>{row.label}</Text>
          <Text style={[typography.bodyBold, { color: row.color ?? colors.text }]}>{row.value}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
