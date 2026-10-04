import Papa from 'papaparse';

/**
 * @typedef {Object} ParsedCsv
 * @property {string[]} headers column headers, in file order
 * @property {Record<string,string>[]} rows data rows, keyed by header
 */

/**
 * Thin wrapper around papaparse. Throws a descriptive Error for malformed
 * input so the bulk-upload use-case can show a single, clear message
 * instead of papaparse's internal error shape.
 * @param {string} csvText
 * @returns {ParsedCsv}
 */
export function parseCsv(csvText) {
  if (!csvText || !csvText.trim()) {
    throw new Error('The selected file is empty.');
  }

  const result = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (!result.meta || !result.meta.fields || result.meta.fields.length === 0) {
    throw new Error('Could not find a header row. Make sure the file is a valid CSV.');
  }

  // papaparse reports "too few/too many fields" as row-level delimiter errors;
  // surface a generic parse failure rather than letting malformed rows through silently.
  const fatalError = result.errors.find((e) => e.type === 'Delimiter' || e.code === 'UndetectableDelimiter');
  if (fatalError) {
    throw new Error('The file does not look like a valid CSV (could not detect a delimiter).');
  }

  return { headers: result.meta.fields, rows: result.data };
}
