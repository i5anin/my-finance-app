// PieChart.js
import { PieChart } from 'vue3-chart-v2'

export default {
  components: {
    PieChart
  },
  data() {
    return {
      chartData: {
        labels: ['Категория 1', 'Категория 2', 'Категория 3'],
        datasets: [
          {
            backgroundColor: ['#f87979', '#7acbf9', '#f9e07a'],
            data: [40, 30, 30]
          }
        ]
      }
    }
  }
}
