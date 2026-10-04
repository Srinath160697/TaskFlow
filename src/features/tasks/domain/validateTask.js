import { PRIORITIES, STATUSES, TITLE_MAX_LENGTH } from '../../../core/utils/constants';
import { isValidIsoDate, isAfter } from '../../../core/utils/date';

/**
 * @typedef {Object} TaskFormValues
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} priority
 * @property {string} startDate
 * @property {string} dueDate
 * @property {string} status
 */

/**
 * Validates task form values and returns a field -> error message map.
 * An empty object means the form is valid. Pure function, no I/O.
 * @param {TaskFormValues} values
 * @returns {Record<string, string>}
 */
export function validateTask(values) {
  const errors = {};

  const title = (values.title ?? '').trim();
  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (values.priority && !PRIORITIES.includes(values.priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}.`;
  }

  if (values.status && !STATUSES.includes(values.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}.`;
  }

  if (!values.startDate) {
    errors.startDate = 'Start date is required.';
  } else if (!isValidIsoDate(values.startDate)) {
    errors.startDate = 'Start date is invalid.';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isValidIsoDate(values.dueDate)) {
    errors.dueDate = 'Due date is invalid.';
  }

  if (!errors.startDate && !errors.dueDate && isAfter(values.startDate, values.dueDate)) {
    errors.dueDate = 'Due date cannot be earlier than start date.';
  }

  return errors;
}

/** @returns {boolean} true if the given errors map represents a valid form */
export function isTaskValid(errors) {
  return Object.keys(errors).length === 0;
}
