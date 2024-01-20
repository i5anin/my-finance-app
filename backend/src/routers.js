const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')

const {
  getTransactionsForCurrentMonth,
  getAllTransactions,
  fillTransactionsWithRandomData,
} = require('./controllers/b_transactions')

// Маршруты для аутентификации
router.get('/database-info', loginController.getDatabaseInfo)
router.get('/transactions/current-month', getTransactionsForCurrentMonth)
router.get('/transactions/all', getAllTransactions)
router.get('/faker', fillTransactionsWithRandomData)

module.exports = router
