<template>
  <v-table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.value">{{ column.text }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name">
        <td v-for="column in columns" :key="column.value">
          <template v-if="column.isImage">
            <img :src="row[column.value]" alt="Изображение" />
          </template>
          <template v-else-if="column.formatter">
            <!-- Использование prefix и postfix напрямую в шаблоне с проверкой на их наличие -->
            <template v-if="column.prefix">{{ column.prefix }}</template>
            {{ column.formatter(row[column.value]) }}
            <template v-if="column.postfix">{{ column.postfix }}</template>
          </template>
          <template v-else>
            {{ column.prefix || '' }}{{ row[column.value]
            }}{{ column.postfix || '' }}
          </template>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { kombatApi } from '../api/kombat'

export default {
  name: 'Table',
  data() {
    return {
      columns: [
        { text: 'Название', value: 'name' },
        { text: 'Местоположение', value: 'location' },
        {
          text: 'Уровень',
          value: 'level',
          formatter: (value) => this.formatNumber(value),
        },
        {
          text: 'Цена',
          value: 'price',
          prefix: '🪙',
          formatter: (value) => this.formatNumber(value),
        },
        {
          text: 'Прибыль в час',
          value: 'profit',
          postfix: ' 🪙/час',
          formatter: (value) => this.formatNumber(value),
        },
        // Изменил форматирование Окупаемости
        {
          text: 'Окупаемость',
          value: 'price_profit_ratio',
          formatter: (value) => Math.round(value),
        },
      ],
      rows: [],
    }
  },
  methods: {
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
      // Форматирование чисел с пробелом в качестве разделителя групп
      return value.toLocaleString('ru-RU')
    },
  },
  mounted() {
    // Получаем данные при монтировании компонента
    this.fetchKombatData()
  },
}
</script>
