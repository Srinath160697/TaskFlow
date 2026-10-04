import { detectDuplicates } from '../../features/bulk-upload/domain/detectDuplicates';

function row(overrides) {
  return {
    id: 'r1',
    title: 'Write report',
    startDate: '2026-10-01',
    dueDate: '2026-10-05',
    rowNumber: 1,
    ...overrides,
  };
}

function existingTask(overrides) {
  return {
    id: 'existing-1',
    title: 'Old task',
    startDate: '2026-09-01',
    dueDate: '2026-09-05',
    status: 'Pending',
    ...overrides,
  };
}

describe('detectDuplicates', () => {
  it('keeps rows that are unique against storage and the file', () => {
    const { uniqueRows, duplicates } = detectDuplicates([row({ rowNumber: 1 })], [existingTask()]);
    expect(uniqueRows).toHaveLength(1);
    expect(duplicates).toHaveLength(0);
  });

  it('flags a row whose id already exists in storage', () => {
    const rows = [row({ id: 'existing-1', rowNumber: 1 })];
    const { uniqueRows, duplicates } = detectDuplicates(rows, [existingTask({ id: 'existing-1' })]);
    expect(uniqueRows).toHaveLength(0);
    expect(duplicates).toEqual([{ row: 1, reason: expect.stringContaining('existing-1') }]);
  });

  it('flags a repeated id within the file, keeping only the first occurrence', () => {
    const rows = [row({ id: 'dup', rowNumber: 1 }), row({ id: 'dup', rowNumber: 2 })];
    const { uniqueRows, duplicates } = detectDuplicates(rows, []);
    expect(uniqueRows.map((r) => r.rowNumber)).toEqual([1]);
    expect(duplicates).toEqual([{ row: 2, reason: expect.stringContaining('dup') }]);
  });

  it('flags a title + start date + due date match against storage', () => {
    const rows = [row({ id: 'new-id', title: 'Old task', startDate: '2026-09-01', dueDate: '2026-09-05', rowNumber: 1 })];
    const { uniqueRows, duplicates } = detectDuplicates(rows, [existingTask()]);
    expect(uniqueRows).toHaveLength(0);
    expect(duplicates[0].reason).toMatch(/same start and due dates/i);
  });

  it('treats titles case-insensitively when matching duplicates', () => {
    const rows = [row({ id: 'new-id', title: 'OLD TASK', startDate: '2026-09-01', dueDate: '2026-09-05', rowNumber: 1 })];
    const { duplicates } = detectDuplicates(rows, [existingTask()]);
    expect(duplicates).toHaveLength(1);
  });

  it('flags a repeated title/date combination within the file itself', () => {
    const rows = [
      row({ id: 'a', title: 'Same', startDate: '2026-10-01', dueDate: '2026-10-05', rowNumber: 1 }),
      row({ id: 'b', title: 'Same', startDate: '2026-10-01', dueDate: '2026-10-05', rowNumber: 2 }),
    ];
    const { uniqueRows, duplicates } = detectDuplicates(rows, []);
    expect(uniqueRows.map((r) => r.id)).toEqual(['a']);
    expect(duplicates).toEqual([{ row: 2, reason: expect.stringContaining('Same') }]);
  });
});
