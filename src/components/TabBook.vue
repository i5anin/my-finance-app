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
      fetch("http://localhost:3000/entries")
          .then(response => response.json())
          .then(data => {
            this.entries = data || [];
            this.calculateTotal();
          });
    },
    formatDate(row, column, cellValue) {
      const date = new Date(cellValue);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
        date: this.form.date,
        amount: this.form.amount,
        category: this.form.category,
      };

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

<style scoped>
/* Ваши стили */
</style>
