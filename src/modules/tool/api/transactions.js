import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const transactionsApi = {
  getTransactionsForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/${year}-${month}`)
      .then(handleResponse)
      .catch(handleApiError),

  getChartForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/chart/${year}-${month}`)
      .then(handleResponse)
      .catch(handleApiError),

  getAvailableYearsAndMonths: async () =>
    axiosInstance
      .get('/years-months')
      .then(handleResponse)
      .catch(handleApiError),

  getIncomeExpenseProfitForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/sum/${year}-${month}`)
      .then(handleResponse)
      .catch(handleApiError),
}
