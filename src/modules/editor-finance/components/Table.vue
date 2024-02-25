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
              <th class="text-left">Дата</th>
              <th class="text-left">id</th>
              <th class="text-left">Сумма</th>
              <th class="text-left">Мой комментарий</th>
              <th class="text-left">Моя категория</th>
              <th class="text-left">Комментарий</th>
              <th class="text-left">Категория</th>
              <th class="text-left">Время</th>
              <th class="text-left">Неделя</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.transaction_id"
              :class="{ alternateBackground: shouldAlternateBackground(index) }"
              @click="onEditRow(transaction)"
            >
              <!--              <td :style="{ color: 'gray' }">{{ index + 1 }}</td>-->
              <td :style="{ color: 'gray' }">
                {{ formatDate(transaction.date_of_operation) }}
              </td>
              <td :style="{ color: 'gray' }">
                {{ transaction.transaction_id }}
              </td>
              <td
                :style="{
                  color:
                    transaction.operation_amount >= 0 ? colorGreen : colorRed,
                  textAlign: 'right',
                }"
              >
                {{ formatNumber(transaction.operation_amount) }}
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
import { ru } from 'date-fns/locale' // Импорт русской локали
import EditToolModal from './Modal.vue'

export default {
  components: { EditToolModal },
  data() {
    return {
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
      // Используем формат 'EEEEEE' и приводим результат к верхнему регистру
      const dayOfWeek = format(date, 'EEEEEE', { locale: ru }).toUpperCase() // Преобразование в верхний регистр
      return dayOfWeek // Теперь вернет 'ПН', 'ВТ' и т.д. большими буквами
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
