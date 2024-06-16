<template>
  <!-- В компоненте Table -->
  <v-checkbox label="Показать" v-model="show"></v-checkbox>
  <Add ref="addForm" @update="fetchKombatData" />
  <v-table>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.value"
          v-show="!column.showColumn || show"
        >
          {{ column.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name" @click="handleRowClick(row.name)">
        <td
          v-for="column in columns"
          :key="column.value"
          v-show="!column.showColumn || show"
        >
          <template v-if="column.isImage">
            <img :src="row[column.value]" alt="Изображение" />
          </template>
          <template v-else-if="column.formatter">
            <!-- Использование prefix и postfix напрямую в шаблоне с проверкой на их наличие -->
            <template v-if="column.prefix">{{ column.prefix }}</template>
            <!-- Добавляем условие для применения класса red-text -->
            <span
              :class="{
                'red-text':
                  column.value === 'price_profit_ratio' &&
                  column.formatter(row[column.value]) < 300,
              }"
            >
              {{ column.formatter(row[column.value]) }}
            </span>
            <template v-if="column.postfix">{{ column.postfix }}</template>
          </template>
          <template v-else>
            {{ column.prefix || '' }}
            {{ row[column.value] }}
            {{ column.postfix || '' }}
          </template>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { kombatApi } from '../api/kombat'
import Add from './Add'

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Table',
  components: { Add },
  data() {
    return {
      show: false,
      columns: [
        { text: 'Название', value: 'name' },
        { text: 'Местоположение', value: 'location' },
        {
          text: 'Уровень',
          value: 'level',
          formatter: (value) => this.formatNumber(value),
        },
        {
          text: 'Цена покупки',
          value: 'price',
          prefix: '🪙',
          formatter: (value) => this.formatNumber(value),
        },
        {
          text: 'Прибыль 🪙/час',
          prefix: '+ ',
          value: 'profit',
          postfix: ' 🪙/час',
          formatter: (value) => this.formatNumber(value),
        },
        // Изменил форматирование Окупаемости
        {
          text: 'Окупаемость',
          value: 'price_profit_ratio',
          formatter: (value) => Math.round(value),
          postfix: ' час',
        },
        {
          text: 'Общая прибыль',
          value: 'total_price',
          formatter: (value) => this.formatNumber(value),
          showColumn: 'show',
        },
        {
          text: '% от цены',
          value: 'percentage', // Это просто метка, реального поля percentage нет
          formatter: (value) => parseFloat(value).toFixed(2) || '',
          showColumn: 'show',
          postfix: ' %',
        },
      ],
      rows: [],
    }
  },
  methods: {
    handleRowClick(name) {
      this.$refs.addForm.fillFormWithName(name) // Вызов метода из компонента Add
    },
    async fetchKombatData() {
      try {
        // Попытка получения данных от API
        const data = await kombatApi.getKombat()
        this.rows = data
      } catch (error) {
        console.error('Ошибка получения данных: ', error)
      }
    },
    formatNumber(value) {
      if (value === null || value === undefined) {
        return '' // Или любое другое значение, которое вы хотите отобразить
      } else {
        return value.toLocaleString('ru-RU')
      }
    },
  },
  mounted() {
    // Получаем данные при монтировании компонента
    this.fetchKombatData()
  },
}
</script>

<style>
/* Можете добавить этот стиль в секцию <style> вашего компонента Table.vue */
.red-text {
  color: #dd6a6a;
}
</style>
