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
    this._chart = new Chart(this.$refs.chart, {
      plugins: {
        legend: {
          position: 'right',
        },
      },
    });
  },
};
</script>
