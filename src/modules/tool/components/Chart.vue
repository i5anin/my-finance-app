<template>
  <Responsive class="w-full">
    <template #main="{ width }">
      <Chart
        direction="circular"
        :size="{ width, height: 400 }"
        :data="data"
        :margin="{
          left: Math.round((width - 360) / 2),
          top: 20,
          right: 0,
          bottom: 20,
        }"
        :axis="axis"
        :config="{ controlHover: false }"
      >
        <template #layers>
          <Pie
            :dataKeys="['name', 'pl']"
            :pie-style="{ innerRadius: 100, padAngle: 0.05 }"
          />
        </template>
        <template #widgets>
          <Tooltip
            :config="{
              name: {},
              avg: { hide: true },
              pl: { label: 'value' },
              inc: { hide: true },
            }"
            hideLine
          />
        </template>
      </Chart>
    </template>
  </Responsive>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
import { toRefs } from 'vue'
import { transactionsApi } from '../api/transactions' // Замените на ваш реальный путь импорта API

export default defineComponent({
  name: 'PieChart',
  components: { Chart, Responsive, Pie, Tooltip },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  setup(props) {
    const { selectedYear, selectedMonth } = toRefs(props)
    const data = ref([])

    const loadData = async () => {
      if (!selectedYear.value || !selectedMonth.value) return
      try {
        const chartData = await transactionsApi.getChartForMonthAndYear(
          selectedYear.value,
          selectedMonth.value
        )
        data.value = chartData.map((item) => ({
          name: item.name,
          pl: item.value,
        })) // Пример адаптации данных под ожидаемый формат
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    watch([selectedYear, selectedMonth], loadData, { immediate: true })

    return { data }
  },
})
</script>
