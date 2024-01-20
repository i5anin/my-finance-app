const express = require('express')
const router = express.Router()

const loginController = require('./controllers/b_login')
// const nomController = require('./controllers/b_tool_nom')
// const paramController = require('./controllers/b_tool_param')
const getTransactionsForCurrentMonth = require('./controllers/b_transactions')
// const skladController = require('./controllers/b_tool_sklad')
// const operController = require('./controllers/b_tool_oper')

// Маршруты для аутентификации
// router.post('/validate-user', loginController.validateUser)
router.get('/database-info', loginController.getDatabaseInfo)

router.get('/transactions/current-month', getTransactionsForCurrentMonth);

module.exports = router
