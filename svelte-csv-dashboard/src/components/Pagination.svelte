<script lang="ts">
  export let totalPages: number = 1;
  export let currentPage: number = 1;
  export let onPageChange: (page: number) => void;

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }
</script>

<div class="flex items-center justify-between mt-4">
  <button
    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    on:click={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <div class="text-sm">
    Page {currentPage} of {totalPages}
  </div>

  <button
    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    on:click={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
