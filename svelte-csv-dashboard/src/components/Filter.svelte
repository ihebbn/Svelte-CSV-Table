<script lang="ts">
  export let headers: string[] = [];
  export let filters: Record<string, string> = {};
  export let onFilterChange: (filters: Record<string, string>) => void;

  function handleInputChange(header: string, value: string) {
    onFilterChange({ ...filters, [header]: value }); // ✅ Correctly updates state
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
  {#each headers as header}
    <div>
      <label class="block text-sm font-medium text-gray-700">{header}</label>
      <input
        type="text"
        placeholder="Filter"
        value={filters[header] || ''}
        class="block w-full px-3 py-2 border rounded"
        on:input={(e) => handleInputChange(header, e.target.value)}
      />
    </div>
  {/each}
</div>
