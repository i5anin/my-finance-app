import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const kombatApi = {
  // Добавить новый инструмент
  getKombat: async () =>
    axiosInstance.get('/kombat').then(handleResponse).catch(handleApiError),

  // Обновить существующий инструмент
  addKombat: async () =>
    axiosInstance.post('/kombat').then(handleResponse).catch(handleApiError),
}
