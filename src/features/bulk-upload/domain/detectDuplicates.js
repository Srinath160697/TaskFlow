/**
 * @typedef {Object} DuplicateReport
 * @property {number} row original 1-based CSV data row number
 * @property {string} reason
 */

/**
 * Splits already-validated CSV rows into rows that are safe to import and
 * duplicates to skip. A row is a duplicate when:
 *  - its id already exists in storage, or repeats earlier in the file, or
 *  - its (title, startDate, dueDate) combination already exists in
 *    storage, or repeats earlier in the file.
 * Rows are processed in file order, so the *first* occurrence of a
 * repeated id/combination is kept and later ones are reported as duplicates.
 * @param {Array<{id:string,title:string,startDate:string,dueDate:string,rowNumber:number}>} rows
 * @param {import('../../tasks/domain/task.entity').Task[]} existingTasks
 * @returns {{ uniqueRows: typeof rows, duplicates: DuplicateReport[] }}
 */
export function detectDuplicates(rows, existingTasks) {
  const existingIds = new Set(existingTasks.map((task) => task.id));
  const existingSignatures = new Set(existingTasks.map(taskSignature));

  const seenIds = new Set();
  const seenSignatures = new Set();
  const uniqueRows = [];
  const duplicates = [];

  for (const row of rows) {
    const signature = taskSignature(row);

    if (existingIds.has(row.id) || seenIds.has(row.id)) {
      duplicates.push({ row: row.rowNumber, reason: `Duplicate id "${row.id}"` });
      continue;
    }
    if (existingSignatures.has(signature) || seenSignatures.has(signature)) {
      duplicates.push({
        row: row.rowNumber,
        reason: `Duplicate task "${row.title}" with the same start and due dates`,
      });
      continue;
    }

    seenIds.add(row.id);
    seenSignatures.add(signature);
    uniqueRows.push(row);
  }

  return { uniqueRows, duplicates };
}

function taskSignature(task) {
  return `${task.title.trim().toLowerCase()}|${task.startDate}|${task.dueDate}`;
}
