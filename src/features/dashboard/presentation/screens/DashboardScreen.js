import { View, Text, Pressable, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';
import { FAB } from '../../../../core/components/FAB';
import { LoadingView } from '../../../../core/components/LoadingView';
import { ErrorView } from '../../../../core/components/ErrorView';
import { EmptyState } from '../../../../core/components/EmptyState';
import { ROUTES } from '../../../../navigation/routes';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';

export function DashboardScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();
  const { stats, isLoading, error, refresh, hasTasks } = useDashboard();

  if (isLoading) return <LoadingView message="Loading your dashboard…" />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <Text style={[typography.h1, { color: colors.text }]}>Dashboard</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
          A snapshot of everything on your plate.
        </Text>

        <View style={[styles.statsGrid, { gap: spacing.md, marginTop: spacing.lg }]}>
          <StatCard icon="layers-outline" label="Total" value={stats.total} accentColor={colors.primary} />
          <StatCard icon="checkmark-done-outline" label="Completed" value={stats.completed} accentColor={colors.success} />
          <StatCard icon="time-outline" label="Pending" value={stats.pending} accentColor={colors.warning} />
          <StatCard icon="today-outline" label="Today" value={stats.today} accentColor={colors.danger} />
        </View>

        {!hasTasks ? (
          <View style={{ marginTop: spacing.xl }}>
            <EmptyState
              icon="checkbox-outline"
              title="No tasks yet"
              message="Add your first task with the + button, or bulk-import a CSV below."
            />
          </View>
        ) : null}

        <Pressable onPress={() => navigation.navigate(ROUTES.BULK_UPLOAD)}>
          <Card style={{ marginTop: spacing.xl }}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h3, { color: colors.text }]}>Bulk upload</Text>
                <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
                  Import many tasks at once from a CSV file.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>
        </Pressable>
      </ScrollView>

      <FAB onPress={() => navigation.navigate(ROUTES.ADD_EDIT_TASK)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
