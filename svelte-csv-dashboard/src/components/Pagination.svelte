<script lang="ts">
  export let totalPages: number = 1;
  export let currentPage: number = 1;
  export let onPageChange: (page: number) => void;

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // Call the parent function
    }
  }

  $: visiblePages = (() => {
    const range = [];
    const min = Math.max(1, currentPage - 1);
    const max = Math.min(totalPages, currentPage + 1);

    if (min > 1) range.push(1, '...');
    for (let i = min; i <= max; i++) range.push(i);
    if (max < totalPages) range.push('...', totalPages);

    return range;
  })();
</script>

<div class="pagination-container">
  <!-- Previous Button -->
  <button
    class="pagination-arrow"
    on:click={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &lsaquo;
  </button>

  <!-- Page Numbers -->
  <div class="pagination-pages">
    {#each visiblePages as page}
      {#if page === '...'}
        <span class="pagination-dots">...</span>
      {:else}
        <button
          class="pagination-number {currentPage === page ? 'pagination-current' : ''}"
          on:click={() => goToPage(page)}
        >
          {page}
        </button>
      {/if}
    {/each}
  </div>

  <!-- Next Button -->
  <button
    class="pagination-arrow"
    on:click={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    &rsaquo;
  </button>
</div>
