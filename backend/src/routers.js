const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')

const {
  getTransactionsForMonthAndYear,
  getAllTransactions,
} = require('./controllers/b_transactions')

const { fillTransactionsWithRandomData } = require('./controllers/b_faker')

// Маршруты для аутентификации
router.get('/database-info', loginController.getDatabaseInfo)

router.get('/transactions/:year-:month', getTransactionsForMonthAndYear)
router.get('/transactions/all', getAllTransactions)
router.get('/faker', fillTransactionsWithRandomData)

module.exports = router
