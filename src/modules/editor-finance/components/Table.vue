<template>
  <EditToolModal
    v-if="openDialog"
    :is-active="openDialog"
    :transaction="selectedTransaction"
    @close-modal="closeModal"
    :persistent="true"
    :tool-id="selectedTransaction ? selectedTransaction.transaction_id : null"
    @canceled="onClosePopup"
    @changes-saved="onSaveChanges"
  />
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-table hover="true">
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
              @click="onEditRow(transaction)"
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
import { transactionsApi } from '../../tool/api/transactions'
import { format, parseISO } from 'date-fns'
import EditToolModal from './Modal.vue'

export default {
  components: { EditToolModal },
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
      selectedTransaction: null,
      openDialog: false,
      isModalActive: false,
      transaction: {
        transaction_id: null,
        my_description: null,
        my_category: null,
        operation_amount: null,
        date_of_operation: null,
        operation_currency: null,
      },
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
    onSaveChanges() {
      this.openDialog = false
      this.$emit('changes-saved')
    },
    onClosePopup() {
      this.openDialog = false
    },
    onCancel() {
      this.$emit('canceled')
    },
    closeModal() {
      this.isModalActive = false
    },
    onEditRow(transaction) {
      this.selectedTransaction = transaction
      this.openDialog = true
    },
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
    formatTime(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'hh:mm')
    },

    async fetchTransactions(year, month) {
      try {
        this.transactions =
          await transactionsApi.getTransactionsForMonthAndYear(year, month)
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error)
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
  background-color: rgba(255, 255, 255, 0.03);
}
</style>
