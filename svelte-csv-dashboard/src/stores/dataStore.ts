import { writable, derived } from 'svelte/store';

// Store for CSV headers and rows
export const csvHeaders = writable<string[]>([]);
export const csvRows = writable<Record<string, any>[]>([]);

// Sorting state store
export const sortState = writable<{ column: string; order: 'asc' | 'desc' }>({
  column: '',
  order: 'asc',
});

// Pagination state store
export const pagination = writable<{ currentPage: number; rowsPerPage: number }>({
  currentPage: 1,
  rowsPerPage: 1000,
});

// Filtering state store
export const filterState = writable<{ column: string; value: string }>({
  column: '',
  value: '',
});

// Derived store for sorting
export const sortedRows = derived(
  [csvRows, sortState],
  ([$csvRows, $sortState]) => {
    if (!$sortState.column || !$csvRows.length) return $csvRows;

    return [...$csvRows].sort((a, b) => {
      let valA = a[$sortState.column] ?? ''; // Ensure column exists
      let valB = b[$sortState.column] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      return $sortState.order === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });
  }
);
