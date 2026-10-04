import { validateTask, isTaskValid } from '../../features/tasks/domain/validateTask';

function baseValues(overrides = {}) {
  return {
    title: 'Write report',
    description: '',
    category: 'Work',
    priority: 'Medium',
    startDate: '2026-10-01',
    dueDate: '2026-10-05',
    status: 'Pending',
    ...overrides,
  };
}

describe('validateTask', () => {
  it('accepts a fully valid task', () => {
    const errors = validateTask(baseValues());
    expect(isTaskValid(errors)).toBe(true);
  });

  it('requires a title', () => {
    const errors = validateTask(baseValues({ title: '' }));
    expect(errors.title).toBeDefined();
  });

  it('rejects a title made only of whitespace', () => {
    const errors = validateTask(baseValues({ title: '   ' }));
    expect(errors.title).toBeDefined();
  });

  it('rejects a title longer than the max length', () => {
    const errors = validateTask(baseValues({ title: 'a'.repeat(101) }));
    expect(errors.title).toBeDefined();
  });

  it('rejects an invalid priority value', () => {
    const errors = validateTask(baseValues({ priority: 'Urgent' }));
    expect(errors.priority).toBeDefined();
  });

  it('rejects an invalid status value', () => {
    const errors = validateTask(baseValues({ status: 'Archived' }));
    expect(errors.status).toBeDefined();
  });

  it('rejects a malformed start date', () => {
    const errors = validateTask(baseValues({ startDate: '10/01/2026' }));
    expect(errors.startDate).toBeDefined();
  });

  it('rejects a due date earlier than the start date', () => {
    const errors = validateTask(baseValues({ startDate: '2026-10-05', dueDate: '2026-10-01' }));
    expect(errors.dueDate).toBeDefined();
  });

  it('accepts a due date equal to the start date', () => {
    const errors = validateTask(baseValues({ startDate: '2026-10-05', dueDate: '2026-10-05' }));
    expect(isTaskValid(errors)).toBe(true);
  });
});
