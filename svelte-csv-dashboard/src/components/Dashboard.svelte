<script lang="ts">
  import Table from './Table.svelte';
  import BarChart from './BarChart.svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  // Chart configuration
  let xAxisColumn: string = headers[0] || ''; // Default X-axis column
  let yAxisColumn: string = headers[1] || ''; // Default Y-axis column
  let aggregationMethod: string = 'sum'; // Default aggregation method

  // State for selected rows
  let selectedRows: Record<string, any>[] = rows;

  function handleSelectedRowsChange(selected: Record<string, any>[]) {
    selectedRows = selected;
  }
</script>

<div class="flex flex-col space-y-8">
  {#if headers.length > 0}
    <div class="flex items-center space-x-4">
      <!-- X-Axis Selection -->
      <div>
        <label for="xAxisColumn" class="block text-sm font-medium text-gray-700">X-Axis:</label>
        <select id="xAxisColumn" class="px-3 py-2 border rounded" bind:value={xAxisColumn}>
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>

      <!-- Y-Axis Selection -->
      <div>
        <label for="yAxisColumn" class="block text-sm font-medium text-gray-700">Y-Axis:</label>
        <select id="yAxisColumn" class="px-3 py-2 border rounded" bind:value={yAxisColumn}>
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>

      <!-- Aggregation Selection -->
      <div>
        <label for="aggregation" class="block text-sm font-medium text-gray-700">Aggregation:</label>
        <select id="aggregation" class="px-3 py-2 border rounded" bind:value={aggregationMethod}>
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
          <option value="countDistinct">Count Distinct</option>
        </select>
      </div>
    </div>
  {/if}

  <!-- Bar Chart -->
  {#if selectedRows.length > 0 && xAxisColumn && yAxisColumn}
    <BarChart {rows} xColumn={xAxisColumn} yColumn={yAxisColumn} aggregation={aggregationMethod} />
  {:else}
    <p class="text-gray-600">Upload a CSV file, select rows, and configure the chart to display data.</p>
  {/if}

  <!-- Data Table -->
  <Table {headers} {rows} on:selectedRowsChange={handleSelectedRowsChange} />
</div>
