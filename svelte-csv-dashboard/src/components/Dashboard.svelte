<script lang="ts">
  import Table from './Table.svelte';
  import BarChart from './BarChart.svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  // State for chart configuration
  let xAxisColumn: string = headers[0] || ''; // Default to the first header
  let yAxisColumn: string = headers[1] || ''; // Default to the second header
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
  {#if rows.length > 0 && xAxisColumn && yAxisColumn}
    <BarChart rows={rows} xColumn={xAxisColumn} yColumn={yAxisColumn} />
  {:else}
    <p class="text-gray-600">Upload a CSV file and configure the chart to display data.</p>
  {/if}

  <!-- Data Table -->
  <Table {headers} {rows} />
</div>
