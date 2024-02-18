<template>
  <div>
    <h3>Сводка за месяц</h3>
    <div v-if="summary">
      <p>Общий доход: {{ summary.total_income }}</p>
      <p>Общий расход: {{ summary.total_expense }}</p>
      <p>Чистая прибыль: {{ summary.net_profit }}</p>
    </div>
    <div v-else>
      <p>Загрузка данных...</p>
    </div>
  </div>
</template>

<script>
import { transactionsApi } from '@/modules/tool/api/transactions'

export default {
  name: 'MonthlySummary',
  data() {
    return {
      summary: null,
    }
  },
  props: {
    year: Number,
    month: Number,
  },
  watch: {
    // Добавьте наблюдатели за пропсами year и month
    year() {
      this.fetchSummary()
    },
    month() {
      this.fetchSummary()
    },
  },
  methods: {
    async fetchSummary() {
      try {
        const summary =
          await transactionsApi.getIncomeExpenseProfitForMonthAndYear(
            this.year,
            this.month
          )
        this.summary = summary
      } catch (error) {
        console.error('Ошибка при получении сводки за месяц:', error)
      }
    },
  },
  mounted() {
    this.fetchSummary()
  },
}
</script>
