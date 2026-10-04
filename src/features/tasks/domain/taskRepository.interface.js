/**
 * Repository contract for task persistence. The domain layer only depends
 * on this shape; `features/tasks/data/taskRepository.asyncstorage.js`
 * provides the concrete AsyncStorage-backed implementation, which
 * presentation hooks inject into the use-case functions below.
 *
 * @typedef {Object} TaskRepository
 * @property {() => Promise<import('./task.entity').Task[]>} getAll
 * @property {(tasks: import('./task.entity').Task[]) => Promise<boolean>} saveAll
 */
