import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';
import { Checkbox } from '../../../../core/components/Checkbox';
import { formatDisplayDate } from '../../../../core/utils/date';
import { PriorityBadge } from './PriorityBadge';

/**
 * Single row in the task list: checkbox, title/category/dates/priority,
 * and a delete action. Tapping the row (outside the checkbox/delete
 * controls) opens Task Details.
 * @param {{ task: import('../../domain/task.entity').Task, onPress: () => void, onToggleComplete: () => void, onDelete: () => void }} props
 */
export function TaskListItem({ task, onPress, onToggleComplete, onDelete }) {
  const { colors, spacing, typography } = useTheme();
  const isCompleted = task.status === 'Completed';

  return (
    <Pressable onPress={onPress}>
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.row}>
          <Checkbox checked={isCompleted} onToggle={onToggleComplete} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text
              numberOfLines={1}
              style={[
                typography.bodyBold,
                {
                  color: colors.text,
                  textDecorationLine: isCompleted ? 'line-through' : 'none',
                },
              ]}
            >
              {task.title}
            </Text>
            {task.category ? (
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>{task.category}</Text>
            ) : null}
            <View style={[styles.row, { marginTop: spacing.sm }]}>
              <PriorityBadge priority={task.priority} />
              <Text style={[typography.caption, { color: colors.textMuted, marginLeft: spacing.sm }]}>
                {formatDisplayDate(task.startDate)} → {formatDisplayDate(task.dueDate)}
              </Text>
            </View>
          </View>
          <Pressable accessibilityLabel="Delete task" onPress={onDelete} style={{ padding: spacing.xs }}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
