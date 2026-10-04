/**
 * Maps a raw CSV row (lower-cased snake_case headers, as produced by
 * csvParser) into the camelCase field shape used by the Task entity.
 * Performs trimming and case-insensitive normalization of priority/status
 * (e.g. "LOW" -> "Low", "pending" -> "Pending") but no validation — see
 * validateCsvRows.js for that.
 * @param {Record<string,string>} row
 * @returns {{ id: string, title: string, description: string, category: string, priority: string, startDate: string, dueDate: string, status: string }}
 */
export function mapCsvRowToTaskFields(row) {
  return {
    id: trim(row.id),
    title: trim(row.title),
    description: trim(row.description),
    category: trim(row.category),
    priority: capitalize(row.priority),
    startDate: trim(row.start_date),
    dueDate: trim(row.due_date),
    status: capitalize(row.status),
  };
}

function trim(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function capitalize(value) {
  const trimmed = trim(value);
  if (!trimmed) return '';
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}
