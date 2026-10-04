import { useState } from 'react';
import { View, FlatList, TextInput, Pressable, Text, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { SegmentedTabs } from '../../../../core/components/SegmentedTabs';
import { Chip } from '../../../../core/components/Chip';
import { EmptyState } from '../../../../core/components/EmptyState';
import { LoadingView } from '../../../../core/components/LoadingView';
import { ErrorView } from '../../../../core/components/ErrorView';
import { ConfirmDialog } from '../../../../core/components/ConfirmDialog';
import { TASK_FILTERS } from '../../../../core/utils/constants';
import { ROUTES } from '../../../../navigation/routes';
import { useTasksContext } from '../hooks/TasksContext';
import { useTaskListFilters } from '../hooks/useTaskListFilters';
import { TaskListItem } from '../components/TaskListItem';
import { SortSheet } from '../components/SortSheet';

export function TaskListScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();
  const { tasks, isLoading, error, refresh, removeTask, toggleStatus } = useTasksContext();
  const {
    statusFilter,
    setStatusFilter,
    searchInput,
    setSearchInput,
    category,
    setCategory,
    categories,
    sort,
    setSort,
    visibleTasks,
    isFiltering,
  } = useTaskListFilters(tasks);

  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  if (isLoading) return <LoadingView message="Loading tasks…" />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={[styles.searchRow, { gap: spacing.sm }]}>
          <View
            style={[
              styles.searchBox,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 10 },
            ]}
          >
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search by title"
              placeholderTextColor={colors.textMuted}
              style={[typography.body, { color: colors.text, flex: 1, marginLeft: spacing.sm }]}
            />
          </View>
          <Pressable
            accessibilityLabel="Sort tasks"
            onPress={() => setSortSheetVisible(true)}
            style={[styles.sortButton, { backgroundColor: colors.surfaceAlt, borderRadius: 10 }]}
          >
            <Ionicons name="swap-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={{ marginTop: spacing.md }}>
          <SegmentedTabs
            options={[TASK_FILTERS.ALL, TASK_FILTERS.PENDING, TASK_FILTERS.COMPLETED]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </View>

        {categories.length > 0 ? (
          <FlatList
            horizontal
            data={['', ...categories]}
            keyExtractor={(item) => item || 'all'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.md }}
            renderItem={({ item }) => (
              <Chip label={item || 'All categories'} selected={category === item} onPress={() => setCategory(item)} />
            )}
          />
        ) : null}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <TaskListItem
            task={item}
            onPress={() => navigation.navigate(ROUTES.TASK_DETAILS, { taskId: item.id })}
            onToggleComplete={() => toggleStatus(item.id, item.status === 'Completed' ? 'Pending' : 'Completed')}
            onDelete={() => setPendingDeleteId(item.id)}
          />
        )}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState
              icon="checkbox-outline"
              title="No tasks yet"
              message="Tap the + button on Home to create your first task."
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="No matching tasks"
              message={isFiltering ? 'Try a different search term or filter.' : 'No tasks in this filter yet.'}
            />
          )
        }
      />

      <SortSheet
        visible={sortSheetVisible}
        field={sort.field}
        direction={sort.direction}
        onChange={setSort}
        onClose={() => setSortSheetVisible(false)}
      />

      <ConfirmDialog
        visible={pendingDeleteId != null}
        title="Delete task?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          removeTask(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  sortButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
