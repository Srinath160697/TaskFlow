/** Centralized route name constants — avoid magic strings when navigating. */
export const ROUTES = {
  TABS: 'Tabs',
  HOME: 'Home',
  TASKS: 'Tasks',
  SETTINGS: 'Settings',
  TASK_DETAILS: 'TaskDetails',
  ADD_EDIT_TASK: 'AddEditTask',
  BULK_UPLOAD: 'BulkUpload',
};

/**
 * Param shapes for the root native-stack navigator.
 *
 * @typedef {Object} RootStackParamList
 * @property {undefined} Tabs
 * @property {{ taskId: string }} TaskDetails
 * @property {{ taskId?: string }} AddEditTask omitting taskId means "create new task"
 * @property {undefined} BulkUpload
 */

/**
 * Param shapes for the bottom-tab navigator nested under "Tabs".
 *
 * @typedef {Object} TabParamList
 * @property {undefined} Home
 * @property {undefined} Tasks
 * @property {undefined} Settings
 */
