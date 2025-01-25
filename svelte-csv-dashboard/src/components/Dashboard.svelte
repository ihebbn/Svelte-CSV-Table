<script lang="ts">
  import Table from './Table.svelte';
  import BarChart from './BarChart.svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  // Chart configuration
  let xAxisColumn: string = headers[0] || ''; // Default X-axis column
  let yAxisColumn: string = headers[1] || ''; // Default Y-axis column

  // State for selected rows
  let selectedRows: Record<string, any>[] = rows;

  // Function to update selected rows from the table
  function handleSelectedRowsChange(selected: Record<string, any>[]) {
    selectedRows = selected; // Update selected rows for the chart
  }
</script>

<div class="flex flex-col space-y-8">
  <!-- Dropdowns for selecting chart axes -->
  {#if headers.length > 0}
    <div class="flex items-center space-x-4">
      <div>
        <label for="xAxisColumn" class="block text-sm font-medium text-gray-700">X-Axis:</label>
        <select
          id="xAxisColumn"
          class="px-3 py-2 border rounded"
          bind:value={xAxisColumn}
        >
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="yAxisColumn" class="block text-sm font-medium text-gray-700">Y-Axis:</label>
        <select
          id="yAxisColumn"
          class="px-3 py-2 border rounded"
          bind:value={yAxisColumn}
        >
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <!-- Bar Chart -->
  {#if selectedRows.length > 0 && xAxisColumn && yAxisColumn}
    <BarChart rows={selectedRows} xColumn={xAxisColumn} yColumn={yAxisColumn} />
  {:else}
    <p class="text-gray-600">Upload a CSV file, select rows, and configure the chart to display data.</p>
  {/if}

  <!-- Data Table -->
  <Table {headers} {rows} on:selectedRowsChange={handleSelectedRowsChange} />
</div>
