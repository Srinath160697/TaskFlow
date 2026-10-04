import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';

/**
 * A single stat tile on the dashboard (Total/Completed/Pending/Today).
 * @param {{ icon: string, label: string, value: number, accentColor: string }} props
 */
export function StatCard({ icon, label, value, accentColor }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Card style={styles.card}>
      <View style={[styles.iconBadge, { backgroundColor: `${accentColor}22` }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <Text style={[typography.h1, { color: colors.text, marginTop: spacing.sm }]}>{value}</Text>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
