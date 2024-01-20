const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')

const {
  getTransactionsForCurrentMonth,
  getAllTransactions,
} = require('./controllers/b_transactions')

// Маршруты для аутентификации
router.get('/database-info', loginController.getDatabaseInfo)
router.get('/transactions/current-month', getTransactionsForCurrentMonth)
router.get('/transactions/all', getAllTransactions)

module.exports = router
