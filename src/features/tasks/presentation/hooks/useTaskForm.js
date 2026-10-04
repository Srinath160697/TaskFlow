import { useEffect, useMemo, useState } from 'react';
import { useTasksContext } from './TasksContext';
import { getTodayIso } from '../../../../core/utils/date';

function emptyFormValues() {
  return {
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    startDate: getTodayIso(),
    dueDate: getTodayIso(),
    status: 'Pending',
  };
}

function toFormValues(task) {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    startDate: task.startDate,
    dueDate: task.dueDate,
    status: task.status,
  };
}

/**
 * Backs the shared Add/Edit Task form. Validation and persistence happen
 * in the domain use-cases (via TasksContext) — this hook only owns the
 * form's local UI state.
 * @param {string|undefined} taskId when provided, the form edits this task instead of creating a new one
 */
export function useTaskForm(taskId) {
  const { tasks, addTask, editTask } = useTasksContext();
  const existingTask = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);

  const [values, setValues] = useState(() => (existingTask ? toFormValues(existingTask) : emptyFormValues()));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Keep the form in sync if the underlying task changes out from under us
  // (e.g. opened right after import), but only before the user has typed anything.
  useEffect(() => {
    if (existingTask) setValues(toFormValues(existingTask));
  }, [existingTask]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function save() {
    setIsSaving(true);
    const result = taskId ? await editTask(taskId, values) : await addTask(values);
    setIsSaving(false);

    if (Object.keys(result.errors).length > 0) {
      setErrors(result.errors);
      return { success: false };
    }
    return { success: true };
  }

  return { values, setField, errors, isSaving, save, isEditing: Boolean(taskId) };
}
