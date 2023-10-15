props: ['entries'],
props: ['entries'],
<template>
  <div>
    <canvas id="bar-chart"></canvas>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['entries'],
  data () {
    return {
      chartData: null
    }
  },
  watch: {
    entries: 'updateChartData'
  },
  methods: {
    updateChartData() {
      const labels = this.entries.map(entry => entry.date);
      const incomes = this.entries.map(entry => entry.amount > 0 ? entry.amount : 0);
      const expenses = this.entries.map(entry => entry.amount < 0 ? entry.amount : 0);

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Доход',
            backgroundColor: '#42b983',
            data: incomes,
          },
          {
            label: 'Расход',
            backgroundColor: '#ff4949',
            data: expenses,
          },
        ],
      };
      this.renderChart(this.chartData, {
        responsive: true,
        maintainAspectRatio: false,
      });
    }
  },
  mounted() {
    this.updateChartData();
  }
}
</script>
