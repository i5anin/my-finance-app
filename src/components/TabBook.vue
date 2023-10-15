<template>
  <div>
    <div>
      <h3 class="mt-4">Общая статистика:</h3>
      <div>
        <span>Общий доход: </span><span>{{ totalIncome }}</span><br>
        <span>Общий расход: </span><span>{{ totalExpense }}</span><br>
        <span>Общая сумма: </span><span>{{ totalSum }}</span>
      </div>

      <h2>Текущая дата: {{ currentDate }}</h2>
      <h3 class="mt-4">Добавить или изменить запись:</h3>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Дата">
          <el-date-picker v-model="form.date" type="date" placeholder="Выберите дату"></el-date-picker>
        </el-form-item>
        <el-form-item label="Сумма">
          <el-input v-model="form.amount" placeholder="Доход/Расход"></el-input>
        </el-form-item>
        <el-form-item label="Категория">
          <el-select v-model="form.category" placeholder="Выберите категорию">
            <el-option label="Еда" value="Еда"></el-option>
            <el-option label="Развлечения" value="Развлечения"></el-option>
            <el-option label="Счета" value="Счета"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateEntry">Добавить/Обновить</el-button>
        </el-form-item>
      </el-form>

      <h3 class="mt-4">Записи:</h3>
      <el-table :data="entries">
        <el-table-column prop="id" label="№"></el-table-column>
        <el-table-column prop="date" label="Дата" :formatter="formatDate"></el-table-column>
        <el-table-column prop="amount" label="Сумма" :formatter="formatAmount"></el-table-column>
        <el-table-column prop="category" label="Категория"></el-table-column>
        <el-table-column label="Действия">
          <template v-slot="scope">
            <el-button @click="loadEntryForEdit(scope.row.id)">Редактировать</el-button>
            <el-button @click="deleteEntry(scope.row.id)">Удалить</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// Импорт функций API
import {getEntries, deleteEntry, addOrUpdateEntry} from '@/api';

export default {
  data() {
    return {
      entries: [],
      form: {
        date: '',
        amount: '',
        category: 'Еда'  // Категория по умолчанию
      },
      totalIncome: 0,
      totalExpense: 0,
      totalSum: 0,
      currentDate: ''
    };
  },
  methods: {
    getEntries() {
      return getEntries()
          .then(data => {
            this.entries = data;
          })
          .catch(error => {
            console.error('Error fetching entries:', error);
          });
    },
    deleteEntry,

    addOrUpdateEntry() {
      const entry = {
        date: this.formatDateForServer(this.form.date),
        amount: this.form.amount,
        category: this.form.category,
      };
      const id = this.form.id ? this.form.id : null;

      // Вызовите функцию addOrUpdateEntry из файла api.js с параметром entry и id
      addOrUpdateEntry(entry, id)
          .then(() => {
            return this.getEntries();
          });
    },
    formatDate(row, column, cellValue) {
      const date = new Date(cellValue);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    formatDateForServer(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },
    formatAmount(row, column, cellValue) {
      return parseFloat(cellValue).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
    },
    setCurrentDate() {
      const today = new Date();
      this.currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    },
    calculateTotal() {
      let totalIncome = 0;
      let totalExpense = 0;
      for (let entry of this.entries) {
        const amount = parseFloat(entry.amount);
        if (amount > 0) {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
      }
      this.totalIncome = totalIncome.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
      this.totalExpense = totalExpense.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
      this.totalSum = (totalIncome + totalExpense).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
    },
    loadEntryForEdit(id) {
      const entry = this.entries.find(e => e.id === id);
      if (entry) {
        this.form.date = entry.date;
        this.form.amount = entry.amount;
        this.form.category = entry.category;
        this.form.id = entry.id;  // сохраните id в форме
      }
    }
  },
  mounted() {
    this.setCurrentDate();
    this.getEntries();
    // Установка даты по умолчанию
    const today = new Date();
    this.form.date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }
};
</script>


