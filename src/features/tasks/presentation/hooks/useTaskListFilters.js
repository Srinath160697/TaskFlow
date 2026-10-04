import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../../core/hooks/useDebouncedValue';
import { TASK_FILTERS, SORT_FIELDS } from '../../../../core/utils/constants';
import { filterTasks, getDistinctCategories } from '../../domain/filterTasks';
import { sortTasks } from '../../domain/sortTasks';

/**
 * Combines status/category/search filtering and sorting into the list the
 * Task List screen renders. All actual logic lives in the domain layer
 * (filterTasks/sortTasks) — this hook only owns the UI state and wiring.
 * @param {import('../../domain/task.entity').Task[]} tasks
 */
export function useTaskListFilters(tasks) {
  const [statusFilter, setStatusFilter] = useState(TASK_FILTERS.ALL);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState({ field: SORT_FIELDS.DUE_DATE, direction: 'asc' });

  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const categories = useMemo(() => getDistinctCategories(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, { statusFilter, searchTerm: debouncedSearch, category });
    return sortTasks(filtered, sort);
  }, [tasks, statusFilter, debouncedSearch, category, sort]);

  const isFiltering = debouncedSearch.trim().length > 0 || category.length > 0;

  return {
    statusFilter,
    setStatusFilter,
    searchInput,
    setSearchInput,
    category,
    setCategory,
    categories,
    sort,
    setSort,
    visibleTasks,
    isFiltering,
  };
}
