<template>
  <v-container>
    <!-- Форма для ввода данных -->
    <v-form>
      <!-- Поле для категории -->
      <v-text-field label="Категория" v-model="entry.category"></v-text-field>
      <!-- Поле для суммы -->
      <v-text-field label="Сумма" v-model="entry.amount" type="number"></v-text-field>
      <!-- Поле для пояснения -->
      <v-textarea label="Пояснение" v-model="entry.description"></v-textarea>
      <!-- Выбор даты -->
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="entry.date" label="Дата" readonly v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="entry.date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(entry.date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <!-- Кнопка добавления данных -->
      <v-btn color="primary" @click="addEntry">Добавить</v-btn>
    </v-form>
    <!-- Таблица для отображения данных -->
    <v-data-table :headers="headers" :items="entries" :items-per-page="5" class="elevation-1"></v-data-table>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      // Объект для хранения данных из формы
      entry: {
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().substr(0, 10),
      },
      // Массив для хранения всех записей
      entries: [],
      // Заголовки для таблицы
      headers: [
        { text: 'Дата', value: 'date' },
        { text: 'Категория', value: 'category' },
        { text: 'Сумма', value: 'amount' },
        { text: 'Пояснение', value: 'description' },
      ],
      // Управление меню выбора даты
      menu: false,
    };
  },
  methods: {
    // Метод для добавления записи
    addEntry() {
      this.entries.push({ ...this.entry });
      // Сортировка записей по дате
      this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Очистка формы после добавления записи
      this.clearForm();
    },
    // Метод для очистки формы
    clearForm() {
      this.entry = { category: '', amount: 0, description: '', date: new Date().toISOString().substr(0, 10) };
    },
  },
};
</script>


