<script lang="ts">
  import Dashboard from '../components/Dashboard.svelte';
  import Papa from 'papaparse';

  let headers: string[] = [];
  let rows: Record<string, any>[] = [];

  async function handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // ✅ Clear rows first to trigger reactivity
      rows = [];
      headers = [];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            alert("Invalid CSV: No data found.");
            return;
          }

          // ✅ Reassign headers and rows properly
          headers = [...Object.keys(results.data[0]).filter(h => h.trim() !== "")];
          rows = [...results.data.filter(row => Object.values(row).some(v => v !== ""))];
        },
      });
    }
  }
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Dynamic CSV Dashboard</h1>

  <!-- File Upload -->
  <div class="mb-4">
    <label class="block text-gray-700 font-bold mb-2" for="csvFile">Upload CSV File:</label>
    <input
      id="csvFile"
      type="file"
      accept=".csv"
      on:change={handleFileUpload}
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
    />
  </div>

  <!-- Render Dashboard -->
  {#if headers.length > 0 && rows.length > 0}
    <Dashboard {headers} {rows} />
  {:else}
    <p class="text-gray-600">Upload a CSV file to visualize the data.</p>
  {/if}
</div>
