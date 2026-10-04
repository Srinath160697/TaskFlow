import { getTodayIso, isWithinRange } from '../../../core/utils/date';

/**
 * @typedef {Object} DashboardStats
 * @property {number} total
 * @property {number} completed
 * @property {number} pending
 * @property {number} today number of tasks whose [startDate, dueDate] range
 *   includes today, or whose dueDate is today
 */

/**
 * Computes dashboard stat-card figures from the full task list. Pure
 * function — takes an optional `todayIso` override so it's deterministic
 * in tests.
 * @param {import('../../tasks/domain/task.entity').Task[]} tasks
 * @param {string} [todayIso]
 * @returns {DashboardStats}
 */
export function getDashboardStats(tasks, todayIso = getTodayIso()) {
  let completed = 0;
  let pending = 0;
  let today = 0;

  for (const task of tasks) {
    if (task.status === 'Completed') completed += 1;
    else pending += 1;

    const isDueToday = task.dueDate === todayIso;
    const isInRange = task.startDate && task.dueDate && isWithinRange(todayIso, task.startDate, task.dueDate);
    if (isDueToday || isInRange) today += 1;
  }

  return { total: tasks.length, completed, pending, today };
}
