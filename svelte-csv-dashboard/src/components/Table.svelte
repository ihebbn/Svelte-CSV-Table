<script lang="ts">
  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  // Sorting state
  let sortColumn: string | null = null;
  let sortOrder: 'asc' | 'desc' | null = null;

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
  }
</script>

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
      {#each rows as row}
        <tr class="hover:bg-gray-50">
          {#each headers as header}
            <td class="border border-gray-300 px-4 py-2">{row[header]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
