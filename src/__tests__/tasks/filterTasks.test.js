import { filterTasks, getDistinctCategories } from '../../features/tasks/domain/filterTasks';
import { sortTasks } from '../../features/tasks/domain/sortTasks';
import { TASK_FILTERS, SORT_FIELDS } from '../../core/utils/constants';

function makeTask(overrides) {
  return {
    id: overrides.id,
    title: overrides.title ?? 'Task',
    description: '',
    category: overrides.category ?? 'Work',
    priority: overrides.priority ?? 'Medium',
    startDate: overrides.startDate ?? '2026-10-01',
    dueDate: overrides.dueDate ?? '2026-10-05',
    status: overrides.status ?? 'Pending',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

const tasks = [
  makeTask({ id: '1', title: 'Buy groceries', category: 'Home', priority: 'Low', dueDate: '2026-10-10' }),
  makeTask({ id: '2', title: 'Finish report', category: 'Work', priority: 'High', status: 'Completed', dueDate: '2026-10-03' }),
  makeTask({ id: '3', title: 'Book flights', category: 'Travel', priority: 'Medium', dueDate: '2026-10-07' }),
];

describe('filterTasks', () => {
  it('returns all tasks when no filters are applied', () => {
    expect(filterTasks(tasks)).toHaveLength(3);
  });

  it('filters by status', () => {
    const pending = filterTasks(tasks, { statusFilter: TASK_FILTERS.PENDING });
    expect(pending.map((t) => t.id)).toEqual(['1', '3']);

    const completed = filterTasks(tasks, { statusFilter: TASK_FILTERS.COMPLETED });
    expect(completed.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by a case-insensitive title search term', () => {
    const results = filterTasks(tasks, { searchTerm: 'REPORT' });
    expect(results.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by category', () => {
    const results = filterTasks(tasks, { category: 'Travel' });
    expect(results.map((t) => t.id)).toEqual(['3']);
  });

  it('combines filters', () => {
    const results = filterTasks(tasks, { statusFilter: TASK_FILTERS.PENDING, searchTerm: 'flights' });
    expect(results.map((t) => t.id)).toEqual(['3']);
  });
});

describe('getDistinctCategories', () => {
  it('returns sorted, de-duplicated categories', () => {
    expect(getDistinctCategories(tasks)).toEqual(['Home', 'Travel', 'Work']);
  });
});

describe('sortTasks', () => {
  it('sorts by due date ascending by default', () => {
    const sorted = sortTasks(tasks, { field: SORT_FIELDS.DUE_DATE });
    expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('sorts by due date descending', () => {
    const sorted = sortTasks(tasks, { field: SORT_FIELDS.DUE_DATE, direction: 'desc' });
    expect(sorted.map((t) => t.id)).toEqual(['1', '3', '2']);
  });

  it('sorts by priority (Low < Medium < High)', () => {
    const sorted = sortTasks(tasks, { field: SORT_FIELDS.PRIORITY });
    expect(sorted.map((t) => t.id)).toEqual(['1', '3', '2']);
  });

  it('does not mutate the original array', () => {
    const copy = [...tasks];
    sortTasks(tasks, { field: SORT_FIELDS.CATEGORY });
    expect(tasks).toEqual(copy);
  });
});
