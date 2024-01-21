<template>
  <v-card>
    <v-select
      v-model="yearTab"
      :items="tabsYears"
      item-text="value"
      item-value="value"
      label="Выберите год"
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
            :selectedMonth="
              monthsYears.findIndex((month) => month.name === monthTab) + 1
            "
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import ToolTabParam from '@/modules/tool/components/tabs/Param.vue'

export default {
  data() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i)
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

    return {
      defaultMonth: 1,
      yearTab: currentYear,
      monthTab: months[currentMonth - 1],
      tabsYears: years.map((year) => ({
        name: year,
        url: `#${year}`,
        component: ToolTabParam,
      })),
      monthsYears: months.map((month, index) => ({
        name: month,
        url: `#${index + 1}`,
        component: ToolTabParam,
      })),
    }
  },
  watch: {
    yearTab(newYear, oldYear) {
      if (newYear !== oldYear) {
        this.monthTab = this.monthsYears[0].name // Устанавливаем месяц на Январь
        console.log(
          'год изменен:',
          newYear,
          'месяц установлен на:',
          this.monthTab
        )
        this.emitUpdateTransactions()
      }
    },
    monthTab(newMonth, oldMonth) {
      if (newMonth !== oldMonth) {
        console.log('месяц изменен:', newMonth, 'в году:', this.yearTab)
        this.emitUpdateTransactions()
      }
    },
  },
  methods: {
    updateHash() {
      let monthIndex =
        this.monthsYears.findIndex((el) => el.name === this.monthTab) + 1
      window.location.hash = `#${this.yearTab}.${monthIndex}`
    },
    emitUpdateTransactions() {
      let year = parseInt(this.yearTab, 10)
      let monthIndex =
        this.monthsYears.findIndex((el) => el.name === this.monthTab) + 1
      this.$emit('updateTransactions', year, monthIndex)
    },

    fetchTransactions(year, month) {
      console.log('-updateHash')
      this.$emit('updateTransactions', year, month)
    },
  },

  mounted() {
    this.fetchTransactions(this.selectedYear, this.selectedMonth)

    // Отслеживание изменений для selectedYear и selectedMonth
    this.$watch(
      () => [this.selectedYear, this.selectedMonth],
      ([newYear, newMonth]) => {
        if (typeof newYear === 'number' && typeof newMonth === 'number') {
          console.log('-updateHash')
          this.fetchTransactions(newYear, newMonth)
        }
      }
    )
  },
}
</script>
