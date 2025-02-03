<script lang="ts">
  import Pagination from './Pagination.svelte';
  import Filter from './Filter.svelte';
  import { createEventDispatcher } from 'svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  const dispatch = createEventDispatcher();

  // State variables
  let sortColumn: string | null = null;
  let sortOrder: 'asc' | 'desc' | null = null;
  let currentPage = 1;
  let rowsPerPage = 1000;
  let totalPages = 1;
  let showDropdown = false; // Dropdown visibility state

  // Filtering state
  let filterColumn: string = headers[0] || '';
  let filterValue: string = '';

  // Column Visibility State
  let selectedColumns = new Set(headers); // Default: Show all columns

  // Handle filter changes
  function handleFilterChange(event: CustomEvent) {
    filterColumn = event.detail.column;
    filterValue = event.detail.value;
  }

  // Sorting function
  function sortTable(column: string) {
    if (sortColumn === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortOrder = 'asc';
    }
  }

  // Toggle column visibility with smooth animation
  function toggleColumn(header: string) {
    const columnElements = document.querySelectorAll(`.${header.replace(/\s+/g, '-')}`);

    columnElements.forEach((col: HTMLElement) => {
      col.style.transition = "opacity 0.3s ease, width 0.3s ease";
      col.style.opacity = "0";
      col.style.width = "0";
    });

    setTimeout(() => {
      if (selectedColumns.has(header)) {
        selectedColumns.delete(header);
      } else {
        selectedColumns.add(header);
      }
      selectedColumns = new Set(selectedColumns); // Force reactivity update

      columnElements.forEach((col: HTMLElement) => {
        col.style.opacity = "1";
        col.style.width = "auto";
      });
    }, 300);
  }

  // Reactive filtered rows
  $: filteredRows = rows.filter((row) => {
    if (!filterColumn || !filterValue) return true;
    const cellValue = row[filterColumn]?.toString().toLowerCase();
    return cellValue.includes(filterValue.toLowerCase());
  });

  // Reactive sorted rows
  $: sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    return sortOrder === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
  });

  // Pagination logic
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
            <th on:click={() => sortTable(header)} class="cursor-pointer {header.replace(/\s+/g, '-')}">
              {header}
              {#if sortColumn === header}
                {sortOrder === 'asc' ? ' ▲' : ' ▼'}
              {/if}
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
              <td class="{header.replace(/\s+/g, '-')}">{row[header]}</td>
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
