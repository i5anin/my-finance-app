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
              <th
                class="text-left"
                v-for="column in columns"
                :key="column.header"
              >
                {{ column.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.transaction_id"
              :class="{
                'alternate-background': shouldAlternateBackground(index),
              }"
              @click="onEditRow(transaction)"
            >
              <td
                v-for="column in columns"
                :key="column.header"
                :style="column.style ? column.style(transaction) : {}"
              >
                {{ column.value(transaction) }}
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
import { ru } from 'date-fns/locale' // Импорт русской локали
import EditToolModal from './Modal.vue'

export default {
  components: { EditToolModal },
  data() {
    return {
      columns: [
        {
          header: 'Дата',
          value: (transaction) =>
            this.formatDate(transaction.date_of_operation),
          style: () => ({ color: 'grey' }),
        },
        {
          header: 'Мой комментарий',
          value: (transaction) => transaction.my_description,
        },
        {
          header: 'Моя категория',
          value: (transaction) => transaction.my_category,
        },
        {
          header: 'Комментарий банка',
          value: (transaction) => transaction.description,
        },
        {
          header: 'Категория банка',
          value: (transaction) => transaction.category,
        },
        {
          header: 'Время',
          value: (transaction) =>
            this.formatTime(transaction.date_of_operation),
          style: () => ({ color: 'grey' }),
        },
        {
          header: 'Неделя',
          value: (transaction) =>
            this.formatDayWeek(transaction.date_of_operation),
          style: (transaction) =>
            this.dayOfWeekStyle(transaction.date_of_operation),
        },
      ],
      colorGreen: '#74e274', // более тусклый зеленый
      colorRed: '#d96c6c', // более тусклый красный
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
    formatNumber(number) {
      return Number(number).toLocaleString('ru-RU')
    },
    formatDate(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'd MMM', { locale: ru }) // Используйте локаль здесь
    },
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
        return { color: this.colorRed }
      }
      return { color: 'white' }
    },
    shouldAlternateBackground(index) {
      return this.alternatedBackgrounds[index]
    },
    formatDayWeek(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'EEEEEE', { locale: ru }).toUpperCase()
    },

    formatTime(timestamp) {
      if (!timestamp || !Date.parse(timestamp)) return 'Неверная дата'
      const date = parseISO(timestamp)
      return format(date, 'hh:mm')
    },

    async fetchTransactions() {
      try {
        this.transactions =
          await transactionsApi.getTransactionsForMonthAndYear(
            this.selectedYear,
            this.selectedMonth
          )
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error)
      }
    },
  },
  mounted() {
    this.fetchTransactions()
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
td {
  white-space: nowrap;
}
</style>
