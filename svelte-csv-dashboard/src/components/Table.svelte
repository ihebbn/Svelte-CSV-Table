<script lang="ts">
  import Pagination from './Pagination.svelte';
  import Filter from './Filter.svelte';
  import { csvHeaders, csvRows } from '../stores/dataStore';
  import { get } from 'svelte/store';

  let headers = get(csvHeaders);
  let rows = get(csvRows);

  $: headers = get(csvHeaders);
  $: rows = get(csvRows);

  let sortColumn: string | null = null;
  let sortOrder: 'asc' | 'desc' | null = null;
  let currentPage = 1;
  let rowsPerPage = 1000;
  let totalPages = 1;
  let paginatedRows = [];

  let worker: Worker | null = null;

  onMount(() => {
    worker = new Worker(new URL('../utils/sortWorker.ts', import.meta.url), { type: 'module' });

    worker.onmessage = (event) => {
      csvRows.set(event.data);
    };
  });

  function sortTable(column: string) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    sortColumn = column;

    if (worker) {
      worker.postMessage({ rows: get(csvRows), column, order: sortOrder });
    }
  }

  // Filtering logic
  let filterColumn = headers[0] || '';
  let filterValue = '';

  function handleFilterChange(event: CustomEvent) {
    filterColumn = event.detail.column;
    filterValue = event.detail.value;
  }

  // Column visibility toggle
  let showDropdown = false;
  let selectedColumns = new Set(headers);

  function toggleColumn(header: string) {
    selectedColumns.has(header) ? selectedColumns.delete(header) : selectedColumns.add(header);
    selectedColumns = new Set(selectedColumns);
  }

  // Pagination
  $: totalPages = Math.ceil(get(csvRows).length / rowsPerPage);
  $: paginatedRows = get(csvRows).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function updateRowsPerPage(value: string) {
    rowsPerPage = value === 'full' ? get(csvRows).length : parseInt(value);
    currentPage = 1;
  }
</script>

<!-- Column Visibility Dropdown -->
<div class="relative mb-4">
  <button on:click={() => showDropdown = !showDropdown} class="styled-toggle-btn">
    Select Columns ▼
  </button>

  {#if showDropdown}
    <div class="checklist-dropdown">
      {#each headers as header}
        <label class="checklist-item">
          <input type="checkbox" class="hidden-checkbox" checked={selectedColumns.has(header)} on:change={() => toggleColumn(header)} />
          <span class="checklist-label">{header}</span>
        </label>
      {/each}
    </div>
  {/if}
</div>

<!-- Filter Component -->
<Filter {headers} on:filterChange={handleFilterChange} />

<!-- Table Section -->
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        {#each headers as header}
          {#if selectedColumns.has(header)}
            <th on:click={() => sortTable(header)} class="cursor-pointer">
              {header} {#if sortColumn === header} {sortOrder === 'asc' ? ' ▲' : ' ▼'} {/if}
            </th>
          {/if}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginatedRows as row}
        <tr>
          {#each headers as header}
            {#if selectedColumns.has(header)}
              <td>{row[header]}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Pagination & Rows Per Page -->
  <div class="pagination-container mt-4">
    <div class="rows-per-page-container">
      <span>Rows per page:</span>
      <select class="rows-per-page-select" on:change={(e) => updateRowsPerPage(e.target.value)}>
        <option value="1000" selected>1000</option>
        <option value="2000">2000</option>
        <option value="full">Full</option>
      </select>
    </div>
    <Pagination {totalPages} {currentPage} onPageChange={handlePageChange} />
  </div>
</div>
