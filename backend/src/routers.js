const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')

const finance = require('./controllers/b_transactions')

const { fillTransactionsWithRandomData } = require('./controllers/b_faker')
const { createAndInsertTransactionsFromXLS } = require('./controllers/b_excel')

// Маршруты для аутентификации
router.get('/database-info', loginController.getDatabaseInfo)

router.get('/transactions/:year-:month', finance.getTransactionsForMonthAndYear)
router.get('/transactions/chart/:year-:month', finance.getChartForMonthAndYear)
router.get('/years-months', finance.getAvailableYearsAndMonths)

// router.get('/transactions/all', finance.getAllTransactions)
router.get('/faker', fillTransactionsWithRandomData)
router.get('/excel', createAndInsertTransactionsFromXLS)

module.exports = router
