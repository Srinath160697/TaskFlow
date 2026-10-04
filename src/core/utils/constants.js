/** Fixed option lists used by forms, filters, and validation across features. */

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['Pending', 'Completed'];

export const TASK_FILTERS = {
  ALL: 'All',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
};

export const SORT_FIELDS = {
  DUE_DATE: 'dueDate',
  START_DATE: 'startDate',
  PRIORITY: 'priority',
  CATEGORY: 'category',
};

export const TITLE_MAX_LENGTH = 100;

export const CSV_REQUIRED_COLUMNS = [
  'id',
  'title',
  'description',
  'category',
  'priority',
  'start_date',
  'due_date',
  'status',
];
