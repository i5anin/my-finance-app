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
  methods: {
    formatDate(timestamp) {
      const date = parseISO(timestamp)
      return format(date, 'HH:mm dd.MM.yy')
    },
    async fetchTransactions(year, month) {
      this.transactions = transactionsApi.getTransactionsForMonthAndYear(
        year,
        month
      )
    },
  },
  mounted() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    this.fetchTransactions(currentYear, currentMonth)
  },
}
</script>
