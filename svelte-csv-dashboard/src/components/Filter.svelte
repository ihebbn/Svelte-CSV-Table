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

<div class="filter-container">
  <div class="filter-group">
    <label for="filterColumn" class="filter-label">Filter By:</label>
    <select id="filterColumn" class="filter-select" bind:value={selectedColumn} on:change={applyFilter}>
      {#each headers as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label for="filterValue" class="filter-label">Value:</label>
    <input
      id="filterValue"
      type="text"
      class="filter-input"
      bind:value={filterValue}
      on:input={applyFilter}
      placeholder="Enter filter value"
    />
  </div>
</div>
