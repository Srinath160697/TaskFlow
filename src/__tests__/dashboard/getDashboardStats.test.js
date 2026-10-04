import { getDashboardStats } from '../../features/dashboard/domain/getDashboardStats';

function makeTask(overrides) {
  return {
    id: overrides.id,
    title: 'Task',
    description: '',
    category: 'Work',
    priority: 'Medium',
    startDate: overrides.startDate,
    dueDate: overrides.dueDate,
    status: overrides.status ?? 'Pending',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

const TODAY = '2026-10-04';

describe('getDashboardStats', () => {
  it('returns all zeros for an empty task list', () => {
    expect(getDashboardStats([], TODAY)).toEqual({ total: 0, completed: 0, pending: 0, today: 0 });
  });

  it('counts total, completed, and pending', () => {
    const tasks = [
      makeTask({ id: '1', startDate: '2026-09-01', dueDate: '2026-09-02', status: 'Completed' }),
      makeTask({ id: '2', startDate: '2026-09-01', dueDate: '2026-09-02', status: 'Pending' }),
      makeTask({ id: '3', startDate: '2026-09-01', dueDate: '2026-09-02', status: 'Pending' }),
    ];
    const stats = getDashboardStats(tasks, TODAY);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });

  it('counts a task as "today" when due exactly today', () => {
    const tasks = [makeTask({ id: '1', startDate: '2026-10-01', dueDate: TODAY })];
    expect(getDashboardStats(tasks, TODAY).today).toBe(1);
  });

  it('counts a task as "today" when today falls within its start/due range', () => {
    const tasks = [makeTask({ id: '1', startDate: '2026-10-01', dueDate: '2026-10-10' })];
    expect(getDashboardStats(tasks, TODAY).today).toBe(1);
  });

  it('does not count a task whose range is entirely in the future', () => {
    const tasks = [makeTask({ id: '1', startDate: '2026-10-10', dueDate: '2026-10-20' })];
    expect(getDashboardStats(tasks, TODAY).today).toBe(0);
  });

  it('does not count a task whose range is entirely in the past', () => {
    const tasks = [makeTask({ id: '1', startDate: '2026-09-01', dueDate: '2026-09-02' })];
    expect(getDashboardStats(tasks, TODAY).today).toBe(0);
  });
});
