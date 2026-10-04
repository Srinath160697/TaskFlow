import { CSV_REQUIRED_COLUMNS, PRIORITIES, STATUSES } from '../../../core/utils/constants';
import { isValidIsoDate, isAfter } from '../../../core/utils/date';
import { mapCsvRowToTaskFields } from './csvRowMapper';

/**
 * @typedef {Object} CsvRowError
 * @property {number} row 1-based data row number (first data row = 1, not counting the header)
 * @property {string} reason
 */

/**
 * Compares the CSV header row against the expected column set.
 * @param {string[]} headers already lower-cased by csvParser
 * @returns {{ missing: string[], extra: string[] }}
 */
export function validateCsvColumns(headers) {
  const missing = CSV_REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  const extra = headers.filter((header) => header && !CSV_REQUIRED_COLUMNS.includes(header));
  return { missing, extra };
}

/**
 * Validates and normalizes every CSV data row. Rows attach their original
 * 1-based row number so later steps (duplicate detection, error reporting)
 * can reference it.
 * @param {Record<string,string>[]} rows raw rows as parsed by papaparse (header: true)
 * @returns {{ validRows: Array<ReturnType<typeof mapCsvRowToTaskFields> & { rowNumber: number }>, errors: CsvRowError[] }}
 */
export function validateCsvRows(rows) {
  const validRows = [];
  const errors = [];

  rows.forEach((raw, index) => {
    const rowNumber = index + 1;
    const fields = mapCsvRowToTaskFields(raw);
    const reasons = [];

    if (!fields.id) reasons.push('missing id');
    if (!fields.title) reasons.push('missing title');

    if (!fields.priority) reasons.push('missing priority');
    else if (!PRIORITIES.includes(fields.priority)) reasons.push(`invalid priority "${raw.priority}"`);

    if (!fields.status) reasons.push('missing status');
    else if (!STATUSES.includes(fields.status)) reasons.push(`invalid status "${raw.status}"`);

    if (!fields.startDate) reasons.push('missing start_date');
    else if (!isValidIsoDate(fields.startDate)) reasons.push(`invalid start_date "${fields.startDate}" (expected YYYY-MM-DD)`);

    if (!fields.dueDate) reasons.push('missing due_date');
    else if (!isValidIsoDate(fields.dueDate)) reasons.push(`invalid due_date "${fields.dueDate}" (expected YYYY-MM-DD)`);

    if (isValidIsoDate(fields.startDate) && isValidIsoDate(fields.dueDate) && isAfter(fields.startDate, fields.dueDate)) {
      reasons.push('due_date is earlier than start_date');
    }

    if (reasons.length > 0) {
      errors.push({ row: rowNumber, reason: capitalizeFirst(reasons.join('; ')) });
    } else {
      validRows.push({ ...fields, rowNumber });
    }
  });

  return { validRows, errors };
}

function capitalizeFirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
