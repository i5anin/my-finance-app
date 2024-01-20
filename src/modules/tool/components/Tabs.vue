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
                :parentId="parentId"
                :type="month.type"
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
    yearTab(newYear, oldYear) {
      if (newYear !== oldYear) {
        this.monthTab = this.monthsYears[0].name // Set to the first month when year changes
        let monthIndex = 1 // Default to the first month
        window.location.hash = `#${newYear}.${monthIndex}` // Update URL hash
        this.fetchTransactions(newYear, this.monthsYears[0].name)
      }
    },
    monthTab(newMonth) {
      let monthIndex =
        this.monthsYears.findIndex((el) => el.name == newMonth) + 1
      window.location.hash = `#${this.yearTab}.${monthIndex}`
      this.fetchTransactions(this.yearTab, newMonth)
    },
  },

  mounted() {
    const hash = window.location.hash.split('.')
    const yearFromHash = hash[0].substring(1)
    const monthFromHash = hash[1]
      ? this.monthsYears[parseInt(hash[1]) - 1].name
      : null

    let currentYearTab = this.tabsYears.find(
      (el) => el.url === `#${yearFromHash}`
    )
    if (currentYearTab) this.yearTab = currentYearTab.name

    if (monthFromHash) {
      this.monthTab = monthFromHash
    } else if (currentYearTab) {
      this.monthTab = this.monthsYears[0].name // Set to the first month if only year is in the hash
    }
  },
}
</script>
