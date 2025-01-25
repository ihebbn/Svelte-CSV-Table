<script lang="ts">
  export let headers: string[] = [];
  export let filters: Record<string, string> = {};
  export let onFilterChange: (filters: Record<string, string>) => void;

  function updateFilter(header: string, value: string) {
    const updatedFilters = { ...filters, [header]: value };
    onFilterChange(updatedFilters);
  }
</script>

<div class="grid gap-4 mb-4">
  {#each headers as header}
    <div>
      <label for="{header}" class="block text-sm font-medium text-gray-700">{header} Filter:</label>
      <input
        id="{header}"
        type="text"
        class="mt-1 px-2 py-1 border rounded w-full"
        placeholder={`Filter by ${header}`}
        on:input={(e) => updateFilter(header, e.target.value)}
      />
    </div>
  {/each}
</div>
