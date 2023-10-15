<template>
  <div class="container">
    <div class="form-section">
      <h3 class="mt-4">Добавить или изменить запись:</h3>
      <el-form ref="form" :model="form" label-position="top">
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
    </div>
    <div class="stats-section">
      <h3 class="mt-4">Общая статистика:</h3>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="label" label="" width="180"/>
        <el-table-column prop="value" label="Данные"/>
      </el-table>
    </div>
  </div>
  <h3 class="mt-4">Записи:</h3>
  <el-table :data="entries">
    <el-table-column prop="id" label="№"></el-table-column>
    <el-table-column prop="date" label="Дата"></el-table-column>
    <el-table-column prop="amount" label="Сумма" :formatter="formatAmount"></el-table-column>
    <el-table-column prop="category" label="Категория"></el-table-column>
    <el-table-column label="Действия">
      <template v-slot="scope">
        <el-button @click="loadEntryForEdit(scope.row.id)">Редактировать</el-button>
        <el-button @click="deleteEntry(scope.row.id)">Удалить</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// Импорт функций API
// Импорт функций API
import {addOrUpdateEntry, deleteEntry, getEntries} from '@/api';
import moment from 'moment';

export default {
  data() {
    return {
      totalIncome: 0,
      totalExpense: 0,
      totalSum: 0,
      currentDate: '',

      entries: [],
      form: {
        date: '',
        amount: '',
        category: 'Еда'  // Категория по умолчанию
      },

    };
  },
  computed: {
    tableData() {
      return [
        {label: 'Общий доход', value: this.formatCurrency(this.totalIncome)},
        {label: 'Общий расход', value: this.formatCurrency(this.totalExpense)},
        {label: 'Общая сумма', value: this.formatCurrency(this.totalSum)},
        {label: 'Текущая дата', value: this.formatDate(this.currentDate)}
      ];
    },
  },
  methods: {
    formatAmount(amount) {
      // Проверяем, является ли amount строкой
      if (typeof amount === 'string') {
        // Удаляем пробелы и заменяем запятую на точку для правильного преобразования в число
        amount = parseFloat(amount.replace(/ /g, '').replace(',', '.'));
      } else if (typeof amount === 'number') {
        // Если amount уже число, то оставляем его как есть
        amount = parseFloat(amount);
      } else if (typeof amount === 'object') {
        // Если amount - это объект (как в случае с "Proxy(Object)"), попробуем получить значение amount из этого объекта
        if (amount.amount) {
          amount = parseFloat(amount.amount);
        }
      }
      // Проверяем, является ли amount числом
      if (!isNaN(amount)) {
        // console.log('Amount:', amount);
        return this.formatCurrency(amount);
      } else {
        return 'не число ₽';
      }
    },
    formatDate(dateString) {
      const date = moment(dateString, 'YYYY-MM-DD');
      if (!date.isValid()) {
        return 'Invalid Date';
      }
      return date.format('DD.MM.YYYY');
    },



    formatCurrency(value) {
      return parseFloat(value).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
      });
    },
    getEntries() {
      return getEntries()
          .then(data => {
            this.entries = data.map(entry => ({
              ...entry,
              originalDate: entry.date,
              date: this.formatDate(entry.date)
            }));
          })
          .then(() => {
            this.calculateTotal();
          })
          .catch(error => {
            console.error('Error fetching entries:', error);
          });
    },

    deleteEntry(id) {
      deleteEntry(id)
          .then(() => {
            return this.getEntries();
          });
    },
    addOrUpdateEntry() {
      const formattedDate = moment(this.form.date).format('YYYY-MM-DD'); // Форматируем дату
      const entry = {
        date: formattedDate,
        amount: this.form.amount,
        category: this.form.category,
      };
      const id = this.form.id ? this.form.id : null;

      addOrUpdateEntry(entry, id)
          .then(() => {
            return this.getEntries();
          });
    },
    setCurrentDate() {
      const today = new Date();
      this.currentDate = moment(today).format('YYYY-MM-DD');
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
      this.totalIncome = totalIncome;  // keep as number
      this.totalExpense = totalExpense;  // keep as number
      this.totalSum = totalIncome + totalExpense;  // keep as number
    },
    loadEntryForEdit(id) {
      const entry = this.entries.find(e => e.id === id);
      if (entry) {
        const dateObj = new Date(entry.date);
        this.form.date = moment(dateObj).format('YYYY-MM-DD');
        this.form.amount = entry.amount;
        this.form.category = entry.category;
        this.form.id = entry.id;
      }
    },


  },
  mounted() {
    this.setCurrentDate();
    this.getEntries();
    const today = new Date();
    this.form.date = this.formatDate(today, 'YYYY-MM-DD'); // Initialize form.date in 'YYYY-MM-DD' format
  }
};
</script>


<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}

.form-section,
.stats-section {
  width: 45%; /* можно изменить в зависимости от ваших потребностей */
}
</style>






