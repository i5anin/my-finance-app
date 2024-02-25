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
import { defineComponent, ref, watch } from 'vue'
import { Chart, Pie, Responsive, Tooltip } from 'vue3-charts'
import { transactionsApi } from '../api/transactions'

export default defineComponent({
  name: 'CircularChart',
  components: { Chart, Responsive, Pie, Tooltip },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  setup(props) {
    const data = ref([])

    const loadData = async () => {
      if (!props.selectedYear || !props.selectedMonth) return
      try {
        data.value = await transactionsApi.getChartForMonthAndYear(
          props.selectedYear,
          props.selectedMonth
        )
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    watch(() => [props.selectedYear, props.selectedMonth], loadData, {
      immediate: true,
    })

    return { data }
  },
})
</script>
