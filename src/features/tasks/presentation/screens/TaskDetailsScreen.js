import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';
import { Button } from '../../../../core/components/Button';
import { ConfirmDialog } from '../../../../core/components/ConfirmDialog';
import { EmptyState } from '../../../../core/components/EmptyState';
import { Checkbox } from '../../../../core/components/Checkbox';
import { formatDisplayDate } from '../../../../core/utils/date';
import { ROUTES } from '../../../../navigation/routes';
import { useTasksContext } from '../hooks/TasksContext';
import { PriorityBadge } from '../components/PriorityBadge';

/** Shows every field of a single task, with mark-complete, edit, and delete actions. */
export function TaskDetailsScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params ?? {};
  const { tasks, toggleStatus, removeTask } = useTasksContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState icon="alert-circle-outline" title="Task not found" message="It may have been deleted." />
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'Completed';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card>
          <View style={styles.headerRow}>
            <Text style={[typography.h2, { color: colors.text, flex: 1 }]}>{task.title}</Text>
            <Checkbox
              checked={isCompleted}
              onToggle={() => toggleStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
              size={28}
            />
          </View>

          <View style={{ marginTop: spacing.sm }}>
            <PriorityBadge priority={task.priority} />
          </View>

          {task.description ? (
            <Text style={[typography.body, { color: colors.text, marginTop: spacing.lg }]}>{task.description}</Text>
          ) : null}

          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <DetailRow label="Category" value={task.category || '—'} />
            <DetailRow label="Status" value={task.status} />
            <DetailRow label="Start date" value={formatDisplayDate(task.startDate)} />
            <DetailRow label="Due date" value={formatDisplayDate(task.dueDate)} />
          </View>
        </Card>

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Button
            title="Edit task"
            variant="secondary"
            onPress={() => navigation.navigate(ROUTES.ADD_EDIT_TASK, { taskId: task.id })}
          />
          <Button title="Delete task" variant="danger" onPress={() => setConfirmDelete(true)} />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete task?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          removeTask(task.id);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value }) {
  const { colors, typography } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text style={[typography.label, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
