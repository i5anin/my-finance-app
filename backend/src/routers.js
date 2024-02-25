const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')

const finance = require('./controllers/b_transactions')
const marker = require('./controllers/b_marker')

const db = require('./controllers/b_excel')

// Маршруты для аутентификации
router.get('/database-info', loginController.getDatabaseInfo)

// router.get('/transactions/month', finance.getIncomeAndExpensePerMonth)
router.get('/transactions/:year-:month', finance.getTransactionsForMonthAndYear)

router.get('/transactions/sum', finance.getMonthlyIncomeExpenseProfit)
router.get('/transactions/sum/:year-:month', finance.getIncomeExpenseProfit)

router.get('/transactions/id/:id', finance.getTransactionById)

router.get('/transactions/chart/:year-:month', finance.getChartForMonthAndYear)
router.get('/years-months', finance.getAvailableYearsAndMonths)

router.get('/crate-database', db.createAndInsertTransactionsFromXLS)
router.get('/update-database', db.updateTransactionsFromXLS)

router.get('/my_custom_marker', marker.myCustomMarker)

module.exports = router
