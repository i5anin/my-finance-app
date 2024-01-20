<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="flex">
          <!--          <h2 class="text-h5">Финансовые операции</h2>-->
          <!--          <v-spacer />-->
        </div>

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
              <td>{{ formatDate(transaction.timestamp) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { transactionsApi } from '../../api/transactions'
import { format, parseISO } from 'date-fns'

export default {
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
      if (!timestamp || !Date.parse(timestamp)) {
        return 'Неверная дата'
      }
      const date = parseISO(timestamp)
      return format(date, 'HH:mm dd.MM.yy')
    },
    async fetchTransactions(year, month) {
      try {
        const transactions =
          await transactionsApi.getTransactionsForMonthAndYear(year, month)
        this.transactions = transactions
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error)
        // Здесь можете обработать ошибку, например, показать сообщение пользователю
      }
    },
    tryFetchTransactions() {
      if (
        typeof this.selectedYear === 'number' &&
        typeof this.selectedMonth === 'number'
      ) {
        // console.log('fetchTransactions')
        // this.fetchTransactions(this.selectedYear, this.selectedMonth)
      }
    },
  },
  watch: {
    selectedYear(newYear, oldYear) {
      if (newYear !== oldYear) {
        // console.log('selectedYear')
        // this.fetchTransactions(newYear, this.selectedMonth)
      }
    },
    selectedMonth(newMonth, oldMonth) {
      if (newMonth !== oldMonth) {
        // console.log('fetchTransactions')
        // this.fetchTransactions(this.selectedYear, newMonth)
      }
    },
  },
  mounted() {
    if (this.selectedYear && this.selectedMonth) {
      // console.log('this.fetchTransactions()')
      // this.fetchTransactions()
    }
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    console.log(currentYear, currentMonth)
    // console.log('mounted') тут нужно вставлять данные
    // this.fetchTransactions(currentYear, currentMonth)
  },
}
</script>
