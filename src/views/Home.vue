<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="flex">
          <h2 class="text-h5">Финансовые Записи</h2>
          <v-spacer />
          <v-btn color="primary" class="mb-2" @click="startAdding">
            Добавить Запись
          </v-btn>
        </div>
        <v-dialog v-model="showDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>{{ dialogTitle }}</v-card-title>
            <v-card-text>
              <v-text-field label="Категория" v-model="entry.category" />
              <v-text-field label="Сумма" v-model="entry.amount" type="number" />
              <v-text-field label="Пояснение" v-model="entry.description" />
              <v-text-field label="Дата" v-model="entry.date" readonly />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showDialog = false">
                Отмена
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveEntry">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-table>
          <thead>
          <tr>
            <th class="text-left">№</th>
            <th class="text-left">Категория</th>
            <th class="text-left">Сумма</th>
            <th class="text-left">Пояснение</th>
            <th class="text-left">Дата</th>
            <th class="text-left">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(entry, index) in financeEntries" :key="entry.id">
            <td>{{ index + 1 }}</td>
            <td>{{ entry.category }}</td>
            <td>{{ entry.amount }}</td>
            <td>{{ entry.description }}</td>
            <td>{{ entry.date }}</td>
            <td>
              <v-btn icon @click="startEditing(entry)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteEntry(entry)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getFinanceEntries, updateFinanceEntry, addFinanceEntry, deleteFinanceEntry } from '@/api'

export default {
  data() {
    return {
      financeEntries: [],
      showDialog: false,
      dialogTitle: '',
      entry: {
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().substr(0, 10)
      },
      editingEntry: null,
    }
  },
  methods: {
    async getData() {
      try {
        this.financeEntries = await getFinanceEntries()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    startAdding() {
      this.dialogTitle = 'Новая Запись'
      this.entry = {
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().substr(0, 10)
      }
      this.editingEntry = null
      this.showDialog = true
    },
    startEditing(entry) {
      this.dialogTitle = 'Редактировать Запись'
      this.entry = { ...entry }
      this.editingEntry = entry
      this.showDialog = true
    },
    async saveEntry() {
      if (this.entry.category && this.entry.amount && this.entry.description && this.entry.date) {
        try {
          if (this.editingEntry) {
            // Обновление существующей записи
            const updatedEntry = { ...this.entry }
            const result = await updateFinanceEntry(this.editingEntry.id, updatedEntry)

            if (result) {
              // Обновление данных в массиве financeEntries
              this.financeEntries = this.financeEntries.map(e =>
                e.id === this.editingEntry.id ? updatedEntry : e
              )
            }
          } else {
            // Добавление новой записи
            const newEntry = await addFinanceEntry(this.entry)
            if (newEntry && newEntry.id) {
              this.financeEntries.push(newEntry)
            } else {
              throw new Error('Failed to add new entry')
            }
          }
        } catch (error) {
          console.error('Error saving finance entry:', error)
        }

        // Сброс данных формы
        this.entry = {
          category: '',
          amount: 0,
          description: '',
          date: new Date().toISOString().substr(0, 10)
        }
        this.showDialog = false
        this.editingEntry = null
      } else {
        alert('Пожалуйста, заполните все поля')
      }
    },
    async deleteEntry(entry) {
      const confirmDelete = confirm(`Вы уверены, что хотите удалить запись: ${entry.category}?`)
      if (confirmDelete) {
        try {
          await deleteFinanceEntry(entry.id)
          this.financeEntries = this.financeEntries.filter(e => e.id !== entry.id)
        } catch (error) {
          console.error('Error deleting finance entry:', error)
        }
      }
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
