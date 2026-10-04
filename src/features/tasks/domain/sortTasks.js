import { SORT_FIELDS } from '../../../core/utils/constants';

const PRIORITY_RANK = { Low: 0, Medium: 1, High: 2 };

/**
 * Returns a new, sorted array of tasks. Pure function — does not mutate
 * its input.
 * @param {import('./task.entity').Task[]} tasks
 * @param {{ field: string, direction?: 'asc'|'desc' }} options
 * @returns {import('./task.entity').Task[]}
 */
export function sortTasks(tasks, { field = SORT_FIELDS.DUE_DATE, direction = 'asc' } = {}) {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;
    switch (field) {
      case SORT_FIELDS.START_DATE:
        comparison = a.startDate.localeCompare(b.startDate);
        break;
      case SORT_FIELDS.PRIORITY:
        comparison = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        break;
      case SORT_FIELDS.CATEGORY:
        comparison = a.category.localeCompare(b.category);
        break;
      case SORT_FIELDS.DUE_DATE:
      default:
        comparison = a.dueDate.localeCompare(b.dueDate);
        break;
    }
    return direction === 'desc' ? -comparison : comparison;
  });
  return sorted;
}
