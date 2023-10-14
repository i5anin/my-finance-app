<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: {
    chartData: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart(this.chartData, {
      plugins: {
        legend: {
          position: 'right',
        },
      },
    });
  },
};
</script>
