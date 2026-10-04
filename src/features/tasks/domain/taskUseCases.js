import { createTaskEntity } from './task.entity';
import { validateTask, isTaskValid } from './validateTask';
import { generateId } from '../../../core/utils/id';

/**
 * Use-case functions for mutating/reading tasks. Each takes a
 * {@link import('./taskRepository.interface').TaskRepository} as its first
 * argument (dependency injection) so this module never imports the
 * concrete AsyncStorage implementation directly.
 */

/**
 * @param {import('./taskRepository.interface').TaskRepository} repository
 * @returns {Promise<import('./task.entity').Task[]>}
 */
export async function listTasks(repository) {
  return repository.getAll();
}

/**
 * Validates and creates a new task.
 * @param {import('./taskRepository.interface').TaskRepository} repository
 * @param {import('./validateTask').TaskFormValues} values
 * @returns {Promise<{ task?: import('./task.entity').Task, errors: Record<string, string> }>}
 */
export async function createTask(repository, values) {
  const errors = validateTask(values);
  if (!isTaskValid(errors)) return { errors };

  const task = createTaskEntity({ ...values, id: generateId() });
  const existing = await repository.getAll();
  await repository.saveAll([...existing, task]);
  return { task, errors: {} };
}

/**
 * Validates and updates an existing task by id.
 * @param {import('./taskRepository.interface').TaskRepository} repository
 * @param {string} id
 * @param {import('./validateTask').TaskFormValues} values
 * @returns {Promise<{ task?: import('./task.entity').Task, errors: Record<string, string> }>}
 */
export async function updateTask(repository, id, values) {
  const errors = validateTask(values);
  if (!isTaskValid(errors)) return { errors };

  const existing = await repository.getAll();
  let updatedTask;
  const next = existing.map((task) => {
    if (task.id !== id) return task;
    updatedTask = createTaskEntity({ ...task, ...values, id, createdAt: task.createdAt });
    return updatedTask;
  });
  await repository.saveAll(next);
  return { task: updatedTask, errors: {} };
}

/**
 * @param {import('./taskRepository.interface').TaskRepository} repository
 * @param {string} id
 * @param {'Pending'|'Completed'} status
 */
export async function setTaskStatus(repository, id, status) {
  const existing = await repository.getAll();
  const next = existing.map((task) =>
    task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
  );
  await repository.saveAll(next);
}

/**
 * @param {import('./taskRepository.interface').TaskRepository} repository
 * @param {string} id
 */
export async function deleteTask(repository, id) {
  const existing = await repository.getAll();
  await repository.saveAll(existing.filter((task) => task.id !== id));
}

/**
 * @param {import('./taskRepository.interface').TaskRepository} repository
 */
export async function clearAllTasks(repository) {
  await repository.saveAll([]);
}
