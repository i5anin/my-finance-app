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
    yearTab() {
      let current_tab = this.tabsYears.find((el) => el.name == this.yearTab)
      window.location.hash = current_tab.url
    },
  },
  mounted() {
    let current_tab = this.tabsYears.find(
      (el) => el.url == window.location.hash
    )
    if (current_tab !== undefined) this.yearTab = current_tab.name
  },
}
</script>
