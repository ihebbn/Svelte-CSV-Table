<script lang="ts">
  export let headers: string[] = [];
  export let rows: Record<string, any>[] = [];
</script>

<div class="overflow-x-auto">
  <table class="table-auto border-collapse border border-gray-300 w-full">
    <thead class="bg-gray-100">
      <tr>
        {#each headers as header}
          <th class="border border-gray-300 px-4 py-2 text-left">{header}</th>
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
