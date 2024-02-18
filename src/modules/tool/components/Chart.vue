<template>
  <Chart
    :size="{ width: 1100, height: 400 }"
    :data="data"
    :margin="margin"
    :direction="direction"
  >
    <template #layers>
      <Grid strokeDasharray="2,2" />
      <Bar :dataKeys="['name', 'pl']" />
    </template>
  </Chart>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Chart, Grid, Bar } from 'vue3-charts' // Импортируйте Bar вместо Line
import { transactionsApi } from '../api/transactions'

export default defineComponent({
  name: 'HistogramChart', // Измените имя компонента для отражения его функциональности
  components: { Chart, Grid, Bar }, // Используйте Bar вместо Line
  setup() {
    const data = ref([])
    const direction = ref('horizontal')
    const margin = ref({
      left: 0,
      top: 50,
      right: 50,
      bottom: 0,
    })

    async function loadData() {
      try {
        const year = 2024
        const month = 1
        const chartData = await transactionsApi.getChartForMonthAndYear(
          year,
          month
        )
        data.value = chartData
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    onMounted(loadData)

    return { data, direction, margin }
  },
})
</script>

<style>
#app {
  color: #2ecc71;
}
</style>
