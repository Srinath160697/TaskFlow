import { useMemo } from 'react';
import { useTasksContext } from '../../../tasks/presentation/hooks/TasksContext';
import { getDashboardStats } from '../../domain/getDashboardStats';

/** Derives dashboard stat-card figures from the shared task list. */
export function useDashboard() {
  const { tasks, isLoading, error, refresh } = useTasksContext();
  const stats = useMemo(() => getDashboardStats(tasks), [tasks]);
  return { stats, isLoading, error, refresh, hasTasks: tasks.length > 0 };
}
