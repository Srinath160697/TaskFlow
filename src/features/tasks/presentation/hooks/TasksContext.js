import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { taskRepository } from '../../data/taskRepository.asyncstorage';
import {
  listTasks,
  createTask as createTaskUseCase,
  updateTask as updateTaskUseCase,
  deleteTask as deleteTaskUseCase,
  setTaskStatus as setTaskStatusUseCase,
  clearAllTasks as clearAllTasksUseCase,
} from '../../domain/taskUseCases';

const TasksContext = createContext(null);

/**
 * App-wide source of truth for tasks. Presentation components never touch
 * AsyncStorage or the repository directly — they call the actions exposed
 * here, which delegate to domain use-cases (which in turn call the
 * injected repository).
 */
export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const result = await listTasks(taskRepository);
      setTasks(result);
    } catch {
      setError('Could not load your tasks.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(
    async (values) => {
      const result = await createTaskUseCase(taskRepository, values);
      if (result.task) await refresh();
      return result;
    },
    [refresh]
  );

  const editTask = useCallback(
    async (id, values) => {
      const result = await updateTaskUseCase(taskRepository, id, values);
      if (result.task) await refresh();
      return result;
    },
    [refresh]
  );

  const removeTask = useCallback(
    async (id) => {
      await deleteTaskUseCase(taskRepository, id);
      await refresh();
    },
    [refresh]
  );

  const toggleStatus = useCallback(
    async (id, status) => {
      await setTaskStatusUseCase(taskRepository, id, status);
      await refresh();
    },
    [refresh]
  );

  const clearAll = useCallback(async () => {
    await clearAllTasksUseCase(taskRepository);
    await refresh();
  }, [refresh]);

  const value = { tasks, isLoading, error, refresh, addTask, editTask, removeTask, toggleStatus, clearAll };
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within a TasksProvider');
  return ctx;
}
