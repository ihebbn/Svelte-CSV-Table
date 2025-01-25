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

  // Reactive declarations
  $: filteredRows = rows.filter((row) => {
    if (!selectedFilterColumn || !filterValue) return true;
    const cellValue = row[selectedFilterColumn]?.toString().toLowerCase();
    return cellValue.includes(filterValue.toLowerCase());
  });

  $: totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  $: paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Function to handle table sorting
  function sortTable(column: string) {
    if (sortColumn === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortOrder = 'asc';
    }

    rows = [...rows].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    currentPage = 1;
  }

  // Function to handle pagination
  function handlePageChange(page: number) {
    currentPage = page;
  }

  // Function to handle row selection
  function toggleRowSelection(index: number) {
    if (selectedRows.has(index)) {
      selectedRows.delete(index);
    } else {
      selectedRows.add(index);
    }

    dispatch(
      'selectionChange',
      Array.from(selectedRows).map((i) => filteredRows[i])
    );
  }
</script>

<div class="table-container">
  <!-- Filter Section -->
  <div class="flex items-center space-x-4 mb-4">
    <div>
      <label for="filterColumn" class="label">Filter by:</label>
      <select id="filterColumn" class="dropdown" bind:value={selectedFilterColumn}>
        {#each headers as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="filterValue" class="label">Value:</label>
      <input
        id="filterValue"
        type="text"
        placeholder="Enter filter value"
        class="input"
        bind:value={filterValue}
      />
    </div>
  </div>

  <!-- Table Section -->
  <table class="table">
    <thead>
      <tr>
        <th>Select</th>
        {#each headers as header}
          <th on:click={() => sortTable(header)}>
            {header}
            {#if sortColumn === header}
              <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginatedRows as row, index}
        <tr>
          <td>
            <input
              type="checkbox"
              on:change={() => toggleRowSelection((currentPage - 1) * rowsPerPage + index)}
            />
          </td>
          {#each headers as header}
            <td>{row[header]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Pagination Section -->
  <div class="pagination-container mt-4">
    <div class="rows-per-page-container">
      <span>Rows per page:</span>
      <select
        class="rows-per-page-select"
        on:change={(e) => {
          const value = e.target.value;
          rowsPerPage = value === 'full' ? filteredRows.length : parseInt(value);
          currentPage = 1;
        }}
      >
        <option value="1000" selected>1000</option>
        <option value="2000">2000</option>
        <option value="full">Full</option>
      </select>
    </div>
    <Pagination {totalPages} {currentPage} onPageChange={handlePageChange} />
  </div>
</div>
