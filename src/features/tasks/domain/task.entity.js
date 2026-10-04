/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {'Low'|'Medium'|'High'} priority
 * @property {string} startDate 'YYYY-MM-DD'
 * @property {string} dueDate 'YYYY-MM-DD'
 * @property {'Pending'|'Completed'} status
 * @property {string} createdAt ISO datetime, set on creation
 * @property {string} updatedAt ISO datetime, set on every save
 */

/**
 * Builds a new Task object with sane defaults, used by the Add/Edit form
 * when creating a task and by the CSV importer when mapping rows.
 * @param {Partial<Task>} fields
 * @returns {Task}
 */
export function createTaskEntity(fields) {
  const now = new Date().toISOString();
  return {
    id: fields.id,
    title: fields.title ?? '',
    description: fields.description ?? '',
    category: fields.category ?? '',
    priority: fields.priority ?? 'Medium',
    startDate: fields.startDate ?? '',
    dueDate: fields.dueDate ?? '',
    status: fields.status ?? 'Pending',
    createdAt: fields.createdAt ?? now,
    updatedAt: now,
  };
}
