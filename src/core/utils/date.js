/**
 * Date helpers. Dates are stored throughout the app as 'YYYY-MM-DD' ISO
 * strings (no time component). All parsing/formatting goes through this
 * module so there is a single source of truth for date logic.
 */

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * @param {string} value
 * @returns {boolean} true if value is a syntactically valid 'YYYY-MM-DD' date
 */
export function isValidIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (month < 1 || month > 12) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
}

/**
 * Returns today's date as a local 'YYYY-MM-DD' string (not UTC, so it
 * matches what the user actually sees as "today" on their device).
 * @returns {string}
 */
export function getTodayIso() {
  return toIsoDate(new Date());
}

/**
 * @param {Date} date
 * @returns {string} 'YYYY-MM-DD' in local time
 */
export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a 'YYYY-MM-DD' string into a local Date set to midnight.
 * @param {string} isoDate
 * @returns {Date|null}
 */
export function parseIsoDate(isoDate) {
  if (!isValidIsoDate(isoDate)) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Lexicographic comparison works for same-format ISO date strings, so these
 * just wrap string comparison for readability at call sites.
 * @returns {boolean} true if `a` is strictly before `b`
 */
export function isBefore(a, b) {
  return a < b;
}

/** @returns {boolean} true if `a` is strictly after `b` */
export function isAfter(a, b) {
  return a > b;
}

/**
 * @param {string} date 'YYYY-MM-DD'
 * @param {string} start 'YYYY-MM-DD'
 * @param {string} end 'YYYY-MM-DD'
 * @returns {boolean} true if date falls within [start, end] inclusive
 */
export function isWithinRange(date, start, end) {
  return date >= start && date <= end;
}

/**
 * Formats a 'YYYY-MM-DD' string for display, e.g. '2026-10-04' -> 'Oct 4, 2026'.
 * @param {string} isoDate
 * @returns {string} the formatted date, or the raw input if it isn't valid
 */
export function formatDisplayDate(isoDate) {
  if (!isValidIsoDate(isoDate)) return isoDate ?? '';
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}
