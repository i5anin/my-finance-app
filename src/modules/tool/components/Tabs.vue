<template>
  <v-card>
    <v-select
      v-model="yearTab"
      :items="tabsYears"
      label="Выберите год"
      :key="tabsYears.length"
    />

    <v-card-text>
      <v-tabs v-model="monthTab">
        <v-tab
          v-for="month in monthsYears"
          :key="month.name"
          :value="month.name"
        >
          {{ month.name }}
        </v-tab>
      </v-tabs>

      <v-window v-model="monthTab">
        <v-window-item
          v-for="month in monthsYears"
          :key="month.name"
          :value="month.name"
        >
          <component
            :is="month.component"
            :type="month.type"
            :selectedYear="parseInt(yearTab, 10)"
            :selectedMonth="getSelectedMonthIndex(monthTab)"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import FinanceTable from '@/modules/tool/components/tabs/FinanceTable.vue'
import { transactionsApi } from '../api/transactions'

export default {
  data() {
    return {
      yearTab: '',
      monthTab: '',
      tabsYears: [],
      monthsYears: [],
    }
  },
  methods: {
    async initializeData() {
      try {
        const availableDataArray =
          await transactionsApi.getAvailableYearsAndMonths()
        const availableData = availableDataArray.reduce((acc, item) => {
          acc[item.yeart] = item.mounth.map((month) => parseInt(month, 10))
          return acc
        }, {})

        this.tabsYears = Object.keys(availableData)
          .map((year) => ({ name: year }))
          .sort((a, b) => b.name - a.name)
        this.yearTab = this.tabsYears[0].name

        this.updateMonthsForYear(this.yearTab, availableData)
      } catch (error) {
        console.error('Ошибка при получении доступных годов и месяцев:', error)
      }
    },

    updateMonthsForYear(year, availableData) {
      const months = availableData[year].map((monthIndex) => ({
        name: this.monthName(monthIndex),
        component: FinanceTable,
      }))

      this.monthsYears = months
      this.monthTab = months[0]?.name
      this.emitUpdateTransactions() // Вызывайте это здесь, чтобы обновить таблицу при изменении года
    },

    monthName(index) {
      const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ]
      return months[index - 1]
    },

    getSelectedMonthIndex(monthName) {
      return this.monthsYears.findIndex((month) => month.name === monthName) + 1
    },

    updateHash() {
      const monthIndex = this.getSelectedMonthIndex(this.monthTab)
      window.location.hash = `#${this.yearTab}.${monthIndex}`
    },

    emitUpdateTransactions() {
      const year = parseInt(this.yearTab, 10)
      const monthIndex = this.getSelectedMonthIndex(this.monthTab)
      this.$emit('updateTransactions', year, monthIndex)
    },

    handleHashChangeOnLoad() {
      const hash = window.location.hash.slice(1)
      const [year, month] = hash.split('.')
      if (year && month) {
        this.yearTab = year
        this.monthTab = this.monthsYears[parseInt(month, 10) - 1]?.name
      }
      this.updateHash()
    },
  },

  watch: {
    yearTab(newYear, oldYear) {
      if (newYear !== oldYear) {
        this.initializeData()
      }
    },

    monthTab(newMonth, oldMonth) {
      if (newMonth !== oldMonth) {
        this.emitUpdateTransactions() // Вызывайте это, чтобы обновить таблицу при изменении месяца
      }
    },
  },

  mounted() {
    this.initializeData()
    this.handleHashChangeOnLoad()
  },
}
</script>
