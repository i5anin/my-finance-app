<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'BarChart',
  data() {
    return {
      chart: null,
      labels: ['January', 'February', 'March', 'April', 'May'],
      incomes: [200, 180, 220, 150, 300],
      expenses: [150, 170, 200, 120, 250],
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = this.$refs.chart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Доход',
              data: this.incomes,
              backgroundColor: '#42b983',
            },
            {
              label: 'Расход',
              data: this.expenses,
              backgroundColor: '#ff4949',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    updateChart() {
      if (this.chart) {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets[0].data = this.incomes;
        this.chart.data.datasets[1].data = this.expenses;
        this.chart.update();
      }
    },
  },
  watch: {
    labels: 'updateChart',
    incomes: 'updateChart',
    expenses: 'updateChart',
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
