<template>
  <v-table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.value">
          {{ column.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name">
        <td v-for="column in columns" :key="column.value">
          <template v-if="column.isImage">
            <img :src="row[column.value]" alt="Изображение" />
          </template>
          <template v-else>
            <!-- Префиксы и постфиксы для значений, если необходимо -->
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

export default {
  name: 'Table',
  data() {
    return {
      // Определите структуру колонок в виде массива объектов
      columns: [
        { text: 'Название', value: 'name' },
        { text: 'Местоположение', value: 'location' },
        { text: 'Уровень', value: 'level' },
        { text: 'Цена', value: 'price', prefix: '🪙' },
        { text: 'Прибыль в час', value: 'profit', postfix: ' 🪙/час' },
        { text: 'Окупаемость', value: 'price_profit_ratio' },

        // { text: 'Изображение', value: 'img', isImage: true },
      ],
      rows: [],
    }
  },
  methods: {
    async fetchKombatData() {
      try {
        const data = await kombatApi.getKombat()
        this.rows = data
      } catch (error) {
        console.error('Ошибка получения данных: ', error)
      }
    },
  },
  mounted() {
    this.fetchKombatData()
  },
}
</script>
