<script lang="ts">
  import Pagination from './Pagination.svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  // Sorting state
  let sortColumn: string | null = null;
  let sortOrder: 'asc' | 'desc' | null = null;

  // Pagination state
  let currentPage = 1;
  let rowsPerPage = 10;

  // Filtering state
  let selectedFilterColumn: string = headers[0] || ''; // Default to the first column
  let filterValue: string = '';

  // Filtered rows
  $: filteredRows = rows.filter((row) => {
    if (!selectedFilterColumn || !filterValue) return true;
    const cellValue = String(row[selectedFilterColumn]).toLowerCase();
    return cellValue.includes(filterValue.toLowerCase());
  });

  // Calculate total pages after filtering
  $: totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // Get paginated rows after filtering
  $: paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Function to sort rows
  function sortTable(column: string) {
    if (sortColumn === column) {
      // Toggle sort order
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column to sort by
      sortColumn = column;
      sortOrder = 'asc';
    }

    // Perform sorting
    rows = [...rows].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Reset to the first page after sorting
    currentPage = 1;
  }

  // Handle page change
  function handlePageChange(page: number) {
    currentPage = page;
  }
</script>

<!-- Dropdown for selecting a filter column -->
<div class="flex items-center space-x-4 mb-4">
  <div>
    <label for="filterColumn" class="block text-sm font-medium text-gray-700">Filter by:</label>
    <select
      id="filterColumn"
      class="px-3 py-2 border rounded"
      bind:value={selectedFilterColumn}
    >
      {#each headers as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
  </div>

  <!-- Input for entering the filter value -->
  <div>
    <label for="filterValue" class="block text-sm font-medium text-gray-700">Value:</label>
    <input
      id="filterValue"
      type="text"
      placeholder="Enter filter value"
      class="px-3 py-2 border rounded"
      bind:value={filterValue}
    />
  </div>
</div>

<!-- Table -->
<div class="overflow-x-auto">
  <table class="table-auto border-collapse border border-gray-300 w-full">
    <thead class="bg-gray-100">
      <tr>
        {#each headers as header}
          <th
            class="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
            on:click={() => sortTable(header)}
          >
            {header}
            <!-- Show sort icon -->
            {#if sortColumn === header}
              <span class="ml-2 text-sm">
                {sortOrder === 'asc' ? '▲' : '▼'}
              </span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginatedRows as row}
        <tr class="hover:bg-gray-50">
          {#each headers as header}
            <td class="border border-gray-300 px-4 py-2">{row[header]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Rows Per Page Selection -->
<div class="flex items-center justify-between mt-4">
  <div>
    <label for="rowsPerPage" class="mr-2 text-sm font-medium text-gray-700">Rows per page:</label>
    <select
      id="rowsPerPage"
      class="px-2 py-1 border rounded"
      on:change={(e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1; // Reset to the first page
      }}
    >
      <option value="10" selected>10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
  </div>
</div>

<!-- Pagination Component -->
<div class="mt-4">
  <Pagination
    {totalPages}
    {currentPage}
    onPageChange={handlePageChange}
  />
</div>
