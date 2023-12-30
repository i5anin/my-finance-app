import axios from 'axios';

const API_URL = 'http://localhost:3000/finance';

export const apiFinance = {
  async fetchEntries() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных:', error.response ? error.response.status : error);
      throw error;
    }
  },

  async addEntry(entry) {
    try {
      const response = await axios.post(API_URL, entry);
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error.response ? error.response.status : error);
      throw error;
    }
  },
};

