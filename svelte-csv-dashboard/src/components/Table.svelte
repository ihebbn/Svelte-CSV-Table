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
  let selectedFilterColumn: string = headers[0] || '';
  let filterValue: string = '';
  let selectedRows = new Set<number>();
  let totalPages = 1; // ✅ Initialize before reactivity

  // Reactive declarations
  $: filteredRows = rows.filter((row) => {
    if (!selectedFilterColumn || !filterValue) return true;
    const cellValue = row[selectedFilterColumn]?.toString().toLowerCase();
    return cellValue.includes(filterValue.toLowerCase());
  });

  $: totalPages = filteredRows.length > 0 ? Math.ceil(filteredRows.length / rowsPerPage) : 1;

  $: paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Function to handle pagination
  function handlePageChange(page: number) {
    currentPage = page;
  }

  // Function to update rows per page
  function updateRowsPerPage(value: string) {
    if (value === 'full') {
      rowsPerPage = 1000; // ✅ Lazy loading instead of full
    } else {
      rowsPerPage = parseInt(value);
    }
    currentPage = 1;
  }
</script>

<div class="table-container">
  <!-- Table Section -->
  <table class="table">
    <thead>
      <tr>
        {#each headers as header}
          <th>{header}</th>
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
      <select
        class="rows-per-page-select"
        on:change={(e) => updateRowsPerPage(e.target.value)}
      >
        <option value="1000" selected>1000</option>
        <option value="2000">2000</option>
        <option value="full">Full</option>
      </select>
    </div>
    <Pagination {totalPages} {currentPage} onPageChange={handlePageChange} />
  </div>
</div>
