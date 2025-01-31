<script lang="ts">
  import Table from './Table.svelte';
  import BarChart from './BarChart.svelte';

  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];

  let xAxisColumn: string = headers[0] || ''; 
  let yAxisColumn: string = headers[1] || ''; 
  let aggregationMethod: string = 'sum';

  let selectedRows: Record<string, any>[] = rows;

  function handleSelectedRowsChange(selected: Record<string, any>[]) {
    selectedRows = selected;
  }
</script>

<!-- ✅ Improved Layout -->
<div class="flex flex-col space-y-6 px-2 sm:px-4">

  <!-- ✅ Responsive Filter Controls -->
  {#if headers.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      
      <!-- X-Axis Dropdown -->
      <div>
        <label for="xAxisColumn" class="block text-sm font-medium text-gray-700">X-Axis:</label>
        <select 
          id="xAxisColumn" 
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          bind:value={xAxisColumn}
        >
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>

      <!-- Y-Axis Dropdown -->
      <div>
        <label for="yAxisColumn" class="block text-sm font-medium text-gray-700">Y-Axis:</label>
        <select 
          id="yAxisColumn" 
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          bind:value={yAxisColumn}
        >
          {#each headers as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>

      <!-- Aggregation Dropdown -->
      <div>
        <label for="aggregation" class="block text-sm font-medium text-gray-700">Aggregation:</label>
        <select 
          id="aggregation" 
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          bind:value={aggregationMethod}
        >
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
          <option value="countDistinct">Count Distinct</option>
        </select>
      </div>

    </div>
  {/if}

  <!-- ✅ Responsive Chart Section -->
  <BarChart 
    {rows} 
    xColumn={xAxisColumn} 
    yColumn={yAxisColumn} 
    aggregation={aggregationMethod} />

  <!-- ✅ Responsive Table Section -->
  <Table {headers} rows={selectedRows} on:selectedRowsChange={handleSelectedRowsChange} />

</div>
