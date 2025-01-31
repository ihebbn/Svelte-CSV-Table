<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount, onDestroy, afterUpdate } from 'svelte';

  export let rows: Record<string, any>[] = [];
  export let xColumn: string = '';
  export let yColumn: string = '';
  export let aggregation: string = 'sum';

  let chartElement: HTMLDivElement;
  let chartInstance: echarts.ECharts | null = null;
  let zooming = false; // ✅ Prevent excessive re-renders during zoom

  function aggregateData() {
    if (!xColumn || !yColumn) return { xData: [], yData: [] };

    let groupedData: Record<string, number[]> = {};

    rows.forEach((row) => {
      let xValue = row[xColumn];
      let yValue = parseFloat(row[yColumn]);

      if (!groupedData[xValue]) groupedData[xValue] = [];
      if (!isNaN(yValue)) groupedData[xValue].push(yValue);
    });

    let xData: string[] = Object.keys(groupedData);
    let yData: number[] = [];

    xData.forEach((key) => {
      let values = groupedData[key];

      switch (aggregation) {
        case 'sum':
          yData.push(values.reduce((a, b) => a + b, 0));
          break;
        case 'average':
          yData.push(values.reduce((a, b) => a + b, 0) / values.length);
          break;
        case 'count':
          yData.push(values.length);
          break;
        case 'countDistinct':
          yData.push(new Set(values).size);
          break;
      }
    });

    return { xData, yData };
  }

  function renderChart() {
    if (!chartElement || !xColumn || !yColumn) return;

    let { xData, yData } = aggregateData();

    if (!xData.length || !yData.length) return;

    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }

    chartInstance = echarts.init(chartElement, null, { 
      width: chartElement.clientWidth, 
      height: chartElement.clientHeight 
    });

    const options = {
      tooltip: { trigger: 'axis' },
      grid: { left: '5%', right: '5%', bottom: '20%', containLabel: true }, // ✅ Ensure labels fit
      xAxis: { 
        type: 'category', 
        data: xData, 
        name: xColumn,
        axisLabel: { rotate: 45, interval: xData.length > 50 ? Math.floor(xData.length / 50) : 0 }
      },
      yAxis: { type: 'value', name: `${aggregation} of ${yColumn}` },
      dataZoom: [
        { type: 'slider', start: 0, end: 10, throttle: 50 }, 
        { type: 'inside', throttle: 50 }
      ],
      progressive: 5000, 
      series: [{
        type: 'bar',
        data: yData,
        name: `${aggregation} of ${yColumn}`,
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#007BFF' },
            { offset: 1, color: '#00C9FF' }
          ])
        }
      }]
    };

    chartInstance.setOption(options);
  }

  function resizeChart() {
    if (chartInstance) {
      chartInstance.resize();
    }
  }

  afterUpdate(() => {
    if (!zooming) {
      setTimeout(() => {
        renderChart();
      }, 1);
    }
  });

  onMount(() => {
    renderChart();
    window.addEventListener('resize', resizeChart); // ✅ Listen for window resize
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
    window.removeEventListener('resize', resizeChart);
  });
</script>

<!-- ✅ Make the chart container responsive -->
<div bind:this={chartElement} class="w-full h-[400px] sm:h-[500px] md:h-[600px] border border-gray-300"></div>
