<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="4">
          <v-combobox
            v-model="form.name"
            :items="this.names"
            label="Название"
            autocomplete="on"
            item-text="name"
            item-value="name"
            clearable
            return-object
            @update:search-input="fetchKombatNames"
            required
          ></v-combobox>
        </v-col>
        <v-col cols="12" sm="3">
          <v-combobox
            v-model="form.location"
            :items="this.locations"
            label="Местоположение"
            autocomplete="on"
            item-text="location"
            item-value="location"
            clearable
            return-object
            @update:search-input="fetchKombatNames"
            required
          ></v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="1">
          <v-text-field
            v-model="form.level"
            label="Уровень"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="form.profit"
            label="Прибыль 🪙/час"
            type="number"
            suffix=" 🪙/час"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="form.price"
            label="Цена покупки"
            prefix="🪙"
            type="number"
          ></v-text-field>
        </v-col>
        <v-btn type="submit" color="primary">Добавить</v-btn>
      </v-row>
      <v-row>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="form.total_price"
            label="Общая прибыль"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { kombatApi } from '../api/kombat'

export default {
  name: 'Add',
  data() {
    return {
      form: {
        name: '',
        location: '',
        level: null,
        price: null,
        profit: null,
        total_price: null,
      },
      rows: [],
      names: [], // массив для уникальных названий
      locations: [], // массив для уникальных местоположений
      search: '', // для поиска в combobox
    }
  },
  methods: {
    fillFormWithName(name) {
      this.form.name = name // Обновление поля name формы
    },
    async fetchKombatData() {
      try {
        const data = await kombatApi.getKombat()
        this.rows = data
      } catch (error) {
        console.error('Ошибка получения данных: ', error)
      }
    },
    async fetchKombatNames() {
      try {
        const data = await kombatApi.getKombatName()
        this.names = data.names
        this.locations = data.locations
      } catch (error) {
        console.error('Ошибка при получении имен: ', error)
      }
    },
    async submitForm() {
      // Проверка и преобразование пустой строки в null для уровня и местоположения
      const formToSubmit = { ...this.form }
      if (formToSubmit.level === '') formToSubmit.level = null
      if (formToSubmit.location === '') formToSubmit.location = null

      try {
        await kombatApi.addKombat(formToSubmit)
        // После успешного добавления очищаем форму
        this.form = {
          name: '',
          location: '',
          level: null,
          price: null,
          profit: null,
          total_price: null,
        }
        await this.fetchKombatData() // Обновляем данные для таблицы
        this.$emit('update') // Испускаем событие для обновления таблицы в родителе
      } catch (error) {
        console.error('Ошибка при добавлении записи: ', error)
      }
    },
  },
  mounted() {
    this.fetchKombatData()
    this.fetchKombatNames()
  },
}
</script>

<style>
.red-text {
  color: red;
}
</style>
