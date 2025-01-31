<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let headers: string[] = [];
  let selectedColumn: string = headers[0] || '';
  let filterValue: string = '';

  const dispatch = createEventDispatcher();

  function applyFilter() {
    dispatch('filterChange', { column: selectedColumn, value: filterValue });
  }
</script>

<div class="flex items-center space-x-4 mb-4">
  <div>
    <label for="filterColumn" class="block text-sm font-medium text-gray-700">Filter By:</label>
    <select
      id="filterColumn"
      class="px-3 py-2 border rounded"
      bind:value={selectedColumn}
      on:change={applyFilter}
    >
      {#each headers as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="filterValue" class="block text-sm font-medium text-gray-700">Value:</label>
    <input
      id="filterValue"
      type="text"
      class="px-3 py-2 border rounded w-64"
      bind:value={filterValue}
      on:input={applyFilter}
      placeholder="Enter filter value"
    />
  </div>
</div>
