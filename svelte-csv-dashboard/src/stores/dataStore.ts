import { writable, derived } from 'svelte/store';

interface SortConfig {
  column: string | null;
  order: 'asc' | 'desc' | null;
}

interface FilterConfig {
  column: string;
  value: string;
}

interface PaginationConfig {
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  showDropdown: boolean;
}

// Initialize stores
export const headers = writable<string[]>([]);
export const rawData = writable<Record<string, any>[]>([]);
export const sortConfig = writable<SortConfig>({ column: null, order: null });
export const filterConfig = writable<FilterConfig>({ column: '', value: '' });
export const selectedColumns = writable<Set<string>>(new Set());
export const pagination = writable<PaginationConfig>({
  currentPage: 1,
  rowsPerPage: 1000,
  totalPages: 1,
  showDropdown: false
});

// Derived stores
export const filteredRows = derived(
  [rawData, filterConfig],
  ([$rawData, $filterConfig]) => 
    $rawData.filter(row => 
      !$filterConfig.column || !$filterConfig.value 
        ? true 
        : String(row[$filterConfig.column]).toLowerCase().includes($filterConfig.value.toLowerCase())
    )
);

export const sortedRows = derived(
  [filteredRows, sortConfig],
  ([$filteredRows, $sortConfig]) => {
    if (!$sortConfig.column) return $filteredRows;
    
    return [...$filteredRows].sort((a, b) => {
      let valA = a[$sortConfig.column!];
      let valB = b[$sortConfig.column!];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      return $sortConfig.order === 'asc' 
        ? valA < valB ? -1 : 1 
        : valA > valB ? -1 : 1;
    });
  }
);

export const paginatedRows = derived(
  [sortedRows, pagination],
  ([$sortedRows, $pagination]) => 
    $sortedRows.slice(
      ($pagination.currentPage - 1) * $pagination.rowsPerPage,
      $pagination.currentPage * $pagination.rowsPerPage
    )
);