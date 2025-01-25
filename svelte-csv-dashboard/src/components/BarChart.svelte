<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount, afterUpdate, onDestroy } from 'svelte';

  export let rows: Record<string, any>[] = [];
  export let xColumn: string = '';
  export let yColumn: string = '';

  let chartElement: HTMLDivElement;
  let chartInstance: echarts.ECharts | null = null;

  function renderChart() {
    if (!chartElement) {
      console.error('Chart element not found.');
      return;
    }
    if (!xColumn || !yColumn) {
      console.error('X or Y axis not selected.');
      return;
    }

    const xData = rows.map((row) => row[xColumn]);
    const yData = rows.map((row) => parseFloat(row[yColumn]) || 0);

    // Check if data is valid
    if (!xData.length || !yData.length) {
      console.error('Invalid data for chart rendering.');
      return;
    }

    if (!chartInstance) {
      chartInstance = echarts.init(chartElement);
    }

    const options = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: xData, name: xColumn },
      yAxis: { type: 'value', name: yColumn },
      series: [
        {
          type: 'bar',
          data: yData,
          name: yColumn,
          itemStyle: { color: '#007BFF' },
        },
      ],
    };

    chartInstance.setOption(options);
  }

  // Re-render chart when inputs change
  afterUpdate(() => {
    renderChart();
  });

  onMount(() => {
    renderChart();
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  });
</script>

<div bind:this={chartElement} class="w-full h-96 border border-gray-300"></div>
