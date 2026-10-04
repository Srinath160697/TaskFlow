import { getItem, setItem } from '../../../core/storage/asyncStorage';
import { TASKS_STORAGE_KEY } from './taskKeys';

/**
 * AsyncStorage-backed implementation of the TaskRepository interface
 * (see domain/taskRepository.interface.js). This is the only module that
 * knows tasks are persisted under `TASKS_STORAGE_KEY` via AsyncStorage.
 * @type {import('../domain/taskRepository.interface').TaskRepository}
 */
export const taskRepository = {
  async getAll() {
    const tasks = await getItem(TASKS_STORAGE_KEY);
    return Array.isArray(tasks) ? tasks : [];
  },

  async saveAll(tasks) {
    return setItem(TASKS_STORAGE_KEY, tasks);
  },
};
