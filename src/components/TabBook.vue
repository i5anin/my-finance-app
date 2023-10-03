<template>
  <el-container>
    <el-header>
      <h3>Общая статистика:</h3>
      <div>
        <span>Общий доход: </span><span>{{ formatAmount(totalIncome) }}</span><br>
        <span>Общий расход: </span><span>{{ formatAmount(totalExpense) }}</span><br>
        <span>Общая сумма: </span><span>{{ formatAmount(totalIncome + totalExpense) }}</span>
      </div>
      <h2>Текущая дата: {{ currentDate }}</h2>
    </el-header>
    <el-main>
      <h3>Добавить или изменить запись:</h3>
      <el-form :model="entryForm" ref="entryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="Дата">
              <el-date-picker v-model="entryForm.date" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Доход/Расход">
              <el-input v-model="entryForm.amount" placeholder="Доход/Расход"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Категория">
              <el-select v-model="entryForm.category" placeholder="Выберите категорию">
                <el-option label="Еда" value="Еда"></el-option>
                <el-option label="Развлечения" value="Развлечения"></el-option>
                <el-option label="Счета" value="Счета"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addOrUpdateEntry">Добавить/Обновить</el-button>
          </el-col>
        </el-row>
      </el-form>
      <h3>Записи:</h3>
      <el-table :data="entries" border style="width: 100%">
        <el-table-column prop="id" label="№" width="180"></el-table-column>
        <el-table-column prop="date" label="Дата" width="180"></el-table-column>
        <el-table-column prop="amount" label="Сумма" width="180"></el-table-column>
        <el-table-column prop="category" label="Категория"></el-table-column>
        <el-table-column label="Действия" width="180">
          <template v-slot="scope">
            <el-button size="mini" @click="loadEntryForEdit(scope.row)">Редактировать</el-button>
            <el-button size="mini" type="danger" @click="deleteEntry(scope.row.id)">Удалить</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  data() {
    return {
      entries: [],
      totalIncome: 0,
      totalExpense: 0,
      currentDate: '',
      entryForm: {
        date: '',
        amount: '',
        category: ''
      }
    };
  },
  methods: {
    formatAmount(amount) {
      return parseFloat(amount).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
    },
    getEntries() {
      return fetch("http://localhost:3000/entries")
          .then((response) => response.json())
          .then((data) => {
            this.entries = data || [];
            this.calculateTotal();
          });
    },
    formatDate(date) {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;

      return `${year}-${month}-${day}`;
    },
    setCurrentDate() {
      const today = new Date();
      this.currentDate = this.formatDate(today);
      this.entryForm.date = this.currentDate;
    },
    deleteEntry(id) {
      fetch(`http://localhost:3000/entries/${id}`, {
        method: "DELETE",
      })
          .then(() => {
            return this.getEntries();
          });
    },
    addOrUpdateEntry() {
      const entry = {
        date: this.entryForm.date,
        amount: this.entryForm.amount,
        category: this.entryForm.category,
      };

      const existingEntry = this.entries.find(
          (e) => e.date === entry.date && e.category === entry.category
      );

      if (existingEntry) {
        fetch(`http://localhost:3000/entries/${existingEntry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
        })
            .then(() => {
              return this.getEntries();
            });
      } else {
        fetch("http://localhost:3000/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
        })
            .then(() => {
              return this.getEntries();
            });
      }
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

      this.totalIncome = totalIncome;
      this.totalExpense = totalExpense;
    },
    loadEntryForEdit(id) {
      const entry = this.entries.find((e) => e.id === id);
      if (entry) {
        this.entryForm.date = entry.date;
        this.entryForm.amount = entry.amount;
        this.entryForm.category = entry.category;
      }
    }
  },
  onMounted() {
    this.setCurrentDate();
    this.getEntries();
  }
};
</script>

<style scoped>
/* Стили вашего компонента */
</style>
