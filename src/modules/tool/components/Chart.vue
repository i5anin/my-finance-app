<template>
  <Chart
    :size="{ width: 1000, height: 400 }"
    :data="data"
    :margin="margin"
    :direction="direction"
  >
    <template #layers>
      <Grid strokeDasharray="2,2" />
      <Line :dataKeys="['name', 'pl']" />
    </template>
  </Chart>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Chart, Grid, Line } from 'vue3-charts'
import { transactionsApi } from '../api/transactions'

export default defineComponent({
  name: 'LineChart',
  components: { Chart, Grid, Line },
  setup() {
    const data = ref([])
    const direction = ref('horizontal')
    const margin = ref({
      left: 0,
      top: 20,
      right: 20,
      bottom: 0,
    })

    // Функция для загрузки данных
    async function loadData() {
      try {
        const year = 2024 // Укажите нужный год
        const month = 1 // Укажите нужный месяц
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
