import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const transactionsApi = {
  getTransactionsForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/${year}/${month}`)
      .then(handleResponse)
      .catch(handleApiError),
}
