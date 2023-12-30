<template>
  <v-container>
    <v-form>
      <v-text-field label="Категория" v-model="entry.category"></v-text-field>
      <v-text-field label="Сумма" v-model="entry.amount" type="number"></v-text-field>
      <v-textarea label="Пояснение" v-model="entry.description"></v-textarea>
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
      <v-btn color="primary" @click="addEntry">Добавить</v-btn>
    </v-form>
    <!-- Таблица данных -->
    <v-data-table :headers="headers" :items="entries" :items-per-page="5" class="elevation-1"></v-data-table>
  </v-container>
</template>

<script>
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
  methods: {
    addEntry() {
      this.entries.push({ ...this.entry });
      this.entries.sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортировка по дате
      this.clearForm();
    },
    clearForm() {
      this.entry = { category: '', amount: 0, description: '', date: new Date().toISOString().substr(0, 10) };
    },
  },
};
</script>

