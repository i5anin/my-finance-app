<template>
  <v-card>
    <v-tabs v-model="yearTab">
      <v-tab v-for="year in tabsYears" :key="year.name" :value="year.name">
        {{ year.name }}
      </v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="yearTab">
        <v-window-item
          v-for="year in tabsYears"
          :key="year.name"
          :value="year.name"
        >
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
      yearTab: currentYear.toString(),
      monthTab: months[currentMonth - 1],
      tabsYears: years.map((year) => ({
        name: year.toString(),
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
    yearTab(newYear) {
      this.monthTab = this.monthsYears[0].name
      this.updateHash()
    },
    monthTab(newMonth) {
      if (newMonth) {
        let monthIndex =
          this.monthsYears.findIndex((el) => el.name === newMonth) + 1
        this.updateHash()
        this.$emit('updateTransactions', parseInt(this.yearTab, 10), monthIndex)
      }
    },
  },
  methods: {
    updateHash() {
      let monthIndex =
        this.monthsYears.findIndex((el) => el.name === this.monthTab) + 1
      window.location.hash = `#${this.yearTab}.${monthIndex}`
    },

    fetchTransactions(year, month) {
      console.log('-updateHash')
      // this.$emit('updateTransactions', year, month)
    },
  },

  mounted() {
    this.fetchTransactions(this.selectedYear, this.selectedMonth)

    // Отслеживание изменений для selectedYear и selectedMonth
    this.$watch(
      () => [this.selectedYear, this.selectedMonth],
      ([newYear, newMonth]) => {
        if (typeof newYear === 'number' && typeof newMonth === 'number') {
          console.log('- this.$watch(')
          this.fetchTransactions(newYear, newMonth)
        }
      }
    )
  },
}
</script>
