/**
 * Generates a reasonably-unique id for new tasks created in the app.
 * Not cryptographically strong — fine for a local-only, no-backend app.
 */
export function generateId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `task_${Date.now().toString(36)}_${random}`;
}
