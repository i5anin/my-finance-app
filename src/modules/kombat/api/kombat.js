import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const kombatApi = {
  // Добавить новый инструмент
  getKombat: async () =>
    axiosInstance.get('/kombat').then(handleResponse).catch(handleApiError),

  getKombatName: async () =>
    axiosInstance
      .get('/kombat-name')
      .then(handleResponse)
      .catch(handleApiError),

  // Обновить существующий инструмент
  addKombat: async (
    formData // formData - это данные формы, переданные от компонента
  ) =>
    axiosInstance
      .post('/kombat', formData)
      .then(handleResponse)
      .catch(handleApiError), // Добавляем formData в тело POST запроса
}
