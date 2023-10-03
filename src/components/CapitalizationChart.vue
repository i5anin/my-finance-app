<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';

const reactiveProp = {
  props: ['chartData'],
  data: function () {
    return {
      _chartData: this.chartData || {
        labels: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'],
        datasets: [{
          label: 'Тестовые данные',
          data: [12, 19, 3, 5, 2],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    }
  },
  watch: {
    chartData: function (newVal) {
      this._chartData = newVal;
      this.$data._chart.update();
    }
  },
}

export default {
  mixins: [reactiveProp],
  mounted() {
    new Chart(this.$refs.chart, {
      type: 'line',
      data: this._chartData,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'YYYY-MM-DD',
              tooltipFormat: 'DD.MM.YYYY',
            },
            title: {
              display: true,
              text: 'Дата',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Капитализация (RUB)',
            },
          },
        },
      },
    });
  },
};
</script>
