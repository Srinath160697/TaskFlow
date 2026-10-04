import { TASK_FILTERS } from '../../../core/utils/constants';

/**
 * Filters tasks by status tab and an optional (debounced) title search term.
 * Pure function — no state, no I/O.
 * @param {import('./task.entity').Task[]} tasks
 * @param {{ statusFilter?: string, searchTerm?: string, category?: string }} options
 * @returns {import('./task.entity').Task[]}
 */
export function filterTasks(tasks, { statusFilter = TASK_FILTERS.ALL, searchTerm = '', category = '' } = {}) {
  const term = searchTerm.trim().toLowerCase();

  return tasks.filter((task) => {
    if (statusFilter === TASK_FILTERS.PENDING && task.status !== 'Pending') return false;
    if (statusFilter === TASK_FILTERS.COMPLETED && task.status !== 'Completed') return false;
    if (category && task.category !== category) return false;
    if (term && !task.title.toLowerCase().includes(term)) return false;
    return true;
  });
}

/**
 * @param {import('./task.entity').Task[]} tasks
 * @returns {string[]} distinct, sorted category names present in the list
 */
export function getDistinctCategories(tasks) {
  const set = new Set(tasks.map((t) => t.category).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
