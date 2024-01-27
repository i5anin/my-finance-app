<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">№</th>
              <th class="text-left">id</th>
              <th class="text-left">Сумма</th>
              <th class="text-left">Мой комментарий</th>
              <th class="text-left">Моя категория</th>
              <th class="text-left">Комментарий</th>
              <th class="text-left">Категория</th>
              <th class="text-left">Время</th>
              <th class="text-left">Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.transaction_id"
              :class="{ alternateBackground: shouldAlternateBackground(index) }"
            >
              <td :style="{ color: 'gray' }">{{ index + 1 }}</td>
              <td :style="{ color: 'gray' }">
                {{ transaction.transaction_id }}
              </td>
              <td
                :style="{
                  color: transaction.operation_amount >= 0 ? 'green' : 'red',
                }"
              >
                {{ transaction.operation_amount }}
                {{ transaction.operation_currency }}
              </td>
              <td>{{ transaction.my_description }}</td>
              <td>{{ transaction.my_category }}</td>
              <td>{{ transaction.description }}</td>
              <td>{{ transaction.category }}</td>
              <td>
                {{ formatTime(transaction.date_of_operation) }}
              </td>
              <td :style="dayOfWeekStyle(transaction.date_of_operation)">
                {{ formatDayWeek(transaction.date_of_operation) }}
              </td>
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
      weekDays: {
        Mon: 'ПН',
        Tue: 'ВТ',
        Wed: 'СР',
        Thu: 'ЧТ',
        Fri: 'ПТ',
        Sat: 'СБ',
        Sun: 'ВС',
      },
      transactions: [],
    }
  },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  computed: {
    alternatedBackgrounds() {
      return this.transactions.map((transaction, index, array) => {
        if (index === 0) return false
        const prevDate = format(
          parseISO(array[index - 1].date_of_operation),
          'yyyy-MM-dd'
        )
        const currentDate = format(
          parseISO(transaction.date_of_operation),
          'yyyy-MM-dd'
        )
        return prevDate !== currentDate
      })
    },
  },
  methods: {
    dayOfWeekStyle(timestamp) {
      const dayOfWeek = this.formatDayWeek(timestamp)
      if (dayOfWeek === 'СБ' || dayOfWeek === 'ВС') {
        return { color: 'red' }
      }
      return { color: 'white' }
    },
    shouldAlternateBackground(index) {
      return this.alternatedBackgrounds[index]
    },
    formatDayWeek(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      const dayOfWeek = format(date, 'EEE')
      return this.weekDays[dayOfWeek] || dayOfWeek
    },
    formatDate(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'dd.MM.yyyy')
    },
    formatTime(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'hh:mm')
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

<style>
.alternateBackground {
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ); /* Или любой другой цвет, подходящий для темной темы */
}
</style>
