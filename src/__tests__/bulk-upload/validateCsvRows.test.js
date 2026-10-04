import { validateCsvColumns, validateCsvRows } from '../../features/bulk-upload/domain/validateCsvRows';

const REQUIRED_HEADERS = ['id', 'title', 'description', 'category', 'priority', 'start_date', 'due_date', 'status'];

function validRow(overrides = {}) {
  return {
    id: 't1',
    title: 'Write report',
    description: 'Quarterly summary',
    category: 'Work',
    priority: 'High',
    start_date: '2026-10-01',
    due_date: '2026-10-05',
    status: 'Pending',
    ...overrides,
  };
}

describe('validateCsvColumns', () => {
  it('passes when all required columns are present', () => {
    const { missing, extra } = validateCsvColumns(REQUIRED_HEADERS);
    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });

  it('reports missing required columns', () => {
    const { missing } = validateCsvColumns(['id', 'title']);
    expect(missing).toEqual(expect.arrayContaining(['category', 'priority', 'start_date', 'due_date', 'status']));
  });

  it('reports extra, unrecognized columns', () => {
    const { extra } = validateCsvColumns([...REQUIRED_HEADERS, 'notes']);
    expect(extra).toEqual(['notes']);
  });
});

describe('validateCsvRows', () => {
  it('accepts a fully valid row', () => {
    const { validRows, errors } = validateCsvRows([validRow()]);
    expect(errors).toHaveLength(0);
    expect(validRows).toHaveLength(1);
    expect(validRows[0]).toMatchObject({ id: 't1', title: 'Write report', priority: 'High', status: 'Pending' });
  });

  it('normalizes priority and status case-insensitively', () => {
    const { validRows } = validateCsvRows([validRow({ priority: 'low', status: 'COMPLETED' })]);
    expect(validRows[0].priority).toBe('Low');
    expect(validRows[0].status).toBe('Completed');
  });

  it('flags a missing title with the correct row number', () => {
    const { errors } = validateCsvRows([validRow(), validRow({ title: '' })]);
    expect(errors).toHaveLength(1);
    expect(errors[0].row).toBe(2);
    expect(errors[0].reason).toMatch(/missing title/i);
  });

  it('flags an invalid priority value', () => {
    const { errors } = validateCsvRows([validRow({ priority: 'Urgent' })]);
    expect(errors[0].reason).toMatch(/invalid priority/i);
  });

  it('flags an invalid date format', () => {
    const { errors } = validateCsvRows([validRow({ start_date: '01/10/2026' })]);
    expect(errors[0].reason).toMatch(/invalid start_date/i);
  });

  it('flags a due date earlier than the start date', () => {
    const { errors } = validateCsvRows([validRow({ start_date: '2026-10-10', due_date: '2026-10-01' })]);
    expect(errors[0].reason).toMatch(/earlier than start_date/i);
  });

  it('keeps valid rows even when other rows in the file are invalid', () => {
    const { validRows, errors } = validateCsvRows([validRow({ id: 't1' }), validRow({ id: '' }), validRow({ id: 't3' })]);
    expect(validRows.map((r) => r.id)).toEqual(['t1', 't3']);
    expect(errors).toHaveLength(1);
  });
});
