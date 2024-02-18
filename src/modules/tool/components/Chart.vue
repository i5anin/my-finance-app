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
import { defineComponent, ref, watch, onMounted, toRefs } from 'vue'
import { Chart, Grid, Bar } from 'vue3-charts'
import { transactionsApi } from '../api/transactions'

export default defineComponent({
  name: 'HistogramChart',
  components: { Chart, Grid, Bar },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  setup(props) {
    const { selectedYear, selectedMonth } = toRefs(props)
    const data = ref([])
    const direction = ref('horizontal')
    const margin = ref({ left: 0, top: 100, right: 100, bottom: 0 })

    const loadData = async () => {
      if (!selectedYear.value || !selectedMonth.value) return
      try {
        const chartData = await transactionsApi.getChartForMonthAndYear(
          selectedYear.value,
          selectedMonth.value
        )
        data.value = chartData
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    watch([selectedYear, selectedMonth], loadData)

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
