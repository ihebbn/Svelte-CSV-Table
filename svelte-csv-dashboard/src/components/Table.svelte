<script lang="ts">
  import Pagination from './Pagination.svelte';
  import { createEventDispatcher } from 'svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  const dispatch = createEventDispatcher();

  // State variables
  let sortColumn: string | null = null;
  let sortOrder: 'asc' | 'desc' | null = null;
  let currentPage = 1;
  let rowsPerPage = 1000;
  let selectedRows = new Set<number>();
  let totalPages = 1;

  // Sorting function
  function sortTable(column: string) {
    if (sortColumn === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortOrder = 'asc';
    }
  }

  // Reactive declarations
  $: sortedRows = [...rows].sort((a, b) => {
    if (!sortColumn) return 0;
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  $: totalPages = sortedRows.length > 0 ? Math.ceil(sortedRows.length / rowsPerPage) : 1;
  $: paginatedRows = sortedRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function updateRowsPerPage(value: string) {
    rowsPerPage = value === 'full' ? sortedRows.length : parseInt(value);
    currentPage = 1;
  }
</script>

<div class="table-container">
  <!-- Table Section -->
  <table class="table">
    <thead>
      <tr>
        {#each headers as header}
          <th on:click={() => sortTable(header)} class="cursor-pointer">
            {header}
            {#if sortColumn === header}
              {sortOrder === 'asc' ? ' ▲' : ' ▼'}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginatedRows as row}
        <tr>
          {#each headers as header}
            <td>{row[header]}</td>
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

<style>
  .cursor-pointer {
    cursor: pointer;
  }
</style>
