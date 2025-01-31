import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { processData } from '../utils/dataProcessor';

export const rawData: Writable<Record<string, any>[]> = writable([]);
export const filters: Writable<Record<string, { type: string; value: string }>> = writable({});
export const sortConfig = writable<{ column: string | null; direction: 'asc' | 'desc' }>({
    column: null,
    direction: 'asc'
});
export const visibleColumns = writable<Set<string>>(new Set());
export const currentPage = writable(1);
export const pageSize = writable(1000);
export const selectedRows = writable<Set<number>>(new Set()); 

// Derived filtered data
export const filteredData: Readable<Record<string, any>[]> = derived(
    [rawData, filters, sortConfig],
    ([$rawData, $filters, $sortConfig]) => {
        if (!$rawData || $rawData.length === 0) return [];
        return processData($rawData, $sortConfig, $filters);
    }
);
