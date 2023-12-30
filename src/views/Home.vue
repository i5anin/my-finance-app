<template>
  <v-container>
    <!-- Форма для ввода данных -->
    <v-form>
      <!-- Поле для категории -->
      <v-text-field label="Категория" v-model="entry.category" />

      <!-- Поле для суммы -->
      <v-text-field label="Сумма" v-model="entry.amount" type="number" />

      <!-- Поле для пояснения -->
      <v-textarea label="Пояснение" v-model="entry.description" />

      <!-- Выбор даты -->
      <v-menu v-model="menu" close-on-content-click="false" nudge-right="40" offset-y min-width="290px">
        <template v-slot:activator="{ attrs, on }">
          <v-text-field v-model="entry.date" label="Дата" readonly v-bind="attrs" v-on="on" />
        </template>
        <v-date-picker v-model="entry.date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
          <v-btn text color="primary" @click="saveDate">OK</v-btn>
        </v-date-picker>
      </v-menu>

      <!-- Кнопка добавления данных -->
      <v-btn color="primary" @click="addEntry">Добавить</v-btn>
    </v-form>

    <!-- Таблица для отображения данных -->
    <v-data-table :headers="headers" :items="entries" items-per-page="5" class="elevation-1" />
  </v-container>
</template>
<script>
import { apiFinance } from '@/api';
export default {
  data() {
    return {
      entry: {
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().substr(0, 10),
      },
      entries: [],
      headers: [
        { text: 'Дата', value: 'date' },
        { text: 'Категория', value: 'category' },
        { text: 'Сумма', value: 'amount' },
        { text: 'Пояснение', value: 'description' },
      ],
      menu: false,
    };
  },
  async created() {
    try {
      this.entries = await apiFinance.fetchEntries();
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  },
  methods: {
    async addEntry() {
      try {
        const newEntry = await apiFinance.addEntry(this.entry);
        this.entries.push(newEntry);
        this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.clearForm();
      } catch (error) {
        console.error('Ошибка при добавлении записи:', error);
      }
    },
    clearForm() {
      this.entry = { category: '', amount: 0, description: '', date: new Date().toISOString().substr(0, 10) };
    },
    saveDate() {
      this.menu = false;
    }
  },
};
</script>
