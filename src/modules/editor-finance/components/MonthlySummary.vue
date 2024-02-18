<template>
  <div>
    <h3>Сводка за месяц</h3>
    <div v-if="summary">
      <p :style="incomeStyle">Общий доход: {{ formattedIncome }}</p>
      <p :style="expenseStyle">Общий расход: {{ formattedExpense }}</p>
      <p :style="profitStyle">Чистая прибыль: {{ formattedProfit }}</p>
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
  computed: {
    formattedIncome() {
      return this.formatNumber(this.summary.total_income)
    },
    formattedExpense() {
      return this.formatNumber(this.summary.total_expense)
    },
    formattedProfit() {
      return this.formatNumber(this.summary.net_profit)
    },
    incomeStyle() {
      return { color: 'green' }
    },
    expenseStyle() {
      return { color: 'red' }
    },
    profitStyle() {
      return { color: this.summary.net_profit < 0 ? 'red' : '' }
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
    formatNumber(value) {
      return new Intl.NumberFormat('ru-RU').format(value)
    },
  },
  watch: {
    year() {
      this.fetchSummary()
    },
    month() {
      this.fetchSummary()
    },
  },
  mounted() {
    this.fetchSummary()
  },
}
</script>
