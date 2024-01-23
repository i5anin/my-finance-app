<template>
  <v-container>
    <!--    <ChartFinance />-->
    <v-row>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">№</th>
              <th class="text-left">Сумма</th>
              <th class="text-left">Комментарий</th>
              <th class="text-left">Категория</th>
              <th class="text-left">Время</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.id"
            >
              <td :style="{ color: 'gray' }">{{ index + 1 }}</td>
              <td :style="{ color: transaction.amount >= 0 ? 'green' : 'red' }">
                {{ transaction.amount }}
              </td>
              <td>{{ transaction.comment }}</td>
              <td>{{ transaction.category }}</td>
              <!-- Обратите внимание на изменения в следующей строке -->
              <td :style="{ color: 'gray' }">
                {{ formatDate(transaction.timestamp) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChartFinance from '../../Сhart.vue'
import { transactionsApi } from '../../api/transactions'
import { format, parseISO } from 'date-fns'

export default {
  components: { ChartFinance },
  data() {
    return {
      transactions: [],
    }
  },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'dd.MM.yyyy')
    },
    async fetchTransactions(year, month) {
      try {
        const response = await transactionsApi.getTransactionsForMonthAndYear(
          year,
          month
        )
        // Проверьте, нужно ли использовать response.data
        this.transactions = response
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error)
      }
    },
  },
  watch: {
    selectedYear(newYear, oldYear) {
      if (newYear !== oldYear) {
        console.log(
          'FinanceTable.vue год:',
          newYear,
          'месяц:',
          this.selectedMonth
        )
        this.fetchTransactions(newYear, this.selectedMonth)
      }
    },
    selectedMonth(newMonth, oldMonth) {
      if (newMonth !== oldMonth) {
        console.log(
          'FinanceTable.vue год:',
          this.selectedYear,
          'месяц:',
          newMonth
        )
        this.fetchTransactions(this.selectedYear, newMonth)
      }
    },
  },
  mounted() {
    if (this.selectedYear && this.selectedMonth) {
      this.fetchTransactions(this.selectedYear, this.selectedMonth)
    }
  },
}
</script>
