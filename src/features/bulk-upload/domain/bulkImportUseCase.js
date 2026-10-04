import { createTaskEntity } from '../../tasks/domain/task.entity';
import { validateCsvColumns, validateCsvRows } from './validateCsvRows';
import { detectDuplicates } from './detectDuplicates';

/**
 * @typedef {Object} BulkImportSummary
 * @property {number} totalRows
 * @property {number} imported
 * @property {number} invalid
 * @property {number} duplicatesSkipped
 * @property {string[]} missingColumns
 * @property {string[]} extraColumns
 * @property {import('./validateCsvRows').CsvRowError[]} errors
 * @property {import('./detectDuplicates').DuplicateReport[]} duplicates
 */

/**
 * Orchestrates a full bulk import: validates the header shape, validates
 * and normalizes every row, filters out duplicates against both storage
 * and the file itself, then persists the surviving rows via the given
 * task repository.
 *
 * Takes already-parsed CSV data ({ headers, rows }) rather than raw text
 * or a file path, so this module has no knowledge of file I/O or the CSV
 * text format — that lives in `features/bulk-upload/data`.
 *
 * @param {import('../../tasks/domain/taskRepository.interface').TaskRepository} repository
 * @param {{ headers: string[], rows: Record<string,string>[] }} parsedCsv
 * @returns {Promise<BulkImportSummary>}
 */
export async function runBulkImport(repository, { headers, rows }) {
  const { missing, extra } = validateCsvColumns(headers);

  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      imported: 0,
      invalid: rows.length,
      duplicatesSkipped: 0,
      missingColumns: missing,
      extraColumns: extra,
      errors: [{ row: 0, reason: `Missing required column(s): ${missing.join(', ')}` }],
      duplicates: [],
    };
  }

  const { validRows, errors } = validateCsvRows(rows);
  const existingTasks = await repository.getAll();
  const { uniqueRows, duplicates } = detectDuplicates(validRows, existingTasks);

  const newTasks = uniqueRows.map((row) =>
    createTaskEntity({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      startDate: row.startDate,
      dueDate: row.dueDate,
      status: row.status,
    })
  );

  if (newTasks.length > 0) {
    await repository.saveAll([...existingTasks, ...newTasks]);
  }

  return {
    totalRows: rows.length,
    imported: newTasks.length,
    invalid: errors.length,
    duplicatesSkipped: duplicates.length,
    missingColumns: missing,
    extraColumns: extra,
    errors,
    duplicates,
  };
}
