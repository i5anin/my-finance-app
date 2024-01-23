<template>
  <v-card>
    <v-select
      v-model="yearTab"
      :items="tabsYears"
      item-text="year"
      item-value="year"
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
    getSelectedMonthIndex(monthName) {
      return this.monthsYears.findIndex((month) => month.name === monthName) + 1
    },
    async initializeData() {
      try {
        const availableData = await transactionsApi.getAvailableYearsAndMonths()
        console.log('Исходные данные:', availableData)

        this.tabsYears = availableData.map((item) => ({
          name: item.yeart,
          value: parseInt(item.yeart),
        }))
        console.log('Обработанные годы:', this.tabsYears)

        this.yearTab = this.tabsYears[0].value
        console.log('Выбранный год:', this.yearTab)

        this.updateMonthsForYear(this.yearTab, availableData)
      } catch (error) {
        console.error('Ошибка при получении доступных годов и месяцев:', error)
      }
    },
    updateMonthsForYear(selectedYear, availableData) {
      const yearData = availableData.find(
        (item) => parseInt(item.yeart, 10) === selectedYear
      )
      if (!yearData) {
        console.error(`Данные для года ${selectedYear} не найдены.`)
        return
      }
      console.log('Данные для выбранного года:', yearData)

      const sortedMonths = yearData.mounth
        .map((monthIndex) => parseInt(monthIndex, 10))
        .sort((a, b) => a - b)
      console.log('Отсортированные месяцы:', sortedMonths)

      const months = sortedMonths.map((monthIndex) => ({
        name: this.monthName(monthIndex.toString()),
        component: FinanceTable,
      }))
      console.log('Объекты месяцев:', months)

      this.monthsYears = months
      this.monthTab = months.length > 0 ? months[0].name : ''
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
      return months[parseInt(index, 10) - 1]
    },
    updateHash() {
      const monthIndex =
        this.monthsYears.findIndex((month) => month.name === this.monthTab) + 1
      window.location.hash = `#${this.yearTab}.${monthIndex}`
    },
    emitUpdateTransactions() {
      const year = parseInt(this.yearTab, 10)
      const monthIndex =
        this.monthsYears.findIndex((month) => month.name === this.monthTab) + 1
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
    async yearTab(newYear, oldYear) {
      if (newYear !== oldYear) {
        try {
          const availableData =
            await transactionsApi.getAvailableYearsAndMonths()
          this.updateMonthsForYear(newYear, availableData)
          this.updateHash()
        } catch (error) {
          console.error('Ошибка при обновлении данных года:', error)
        }
      }
    },
    monthTab(newMonth, oldMonth) {
      if (newMonth !== oldMonth) {
        this.updateHash()
      }
    },
  },
  mounted() {
    this.initializeData()
    this.handleHashChangeOnLoad()
  },
}
</script>
