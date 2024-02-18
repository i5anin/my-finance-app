const { Pool } = require('pg')
const { getNetworkDetails } = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig =
  networkDetails.databaseType === 'build'
    ? config.dbConfig
    : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)
async function getIncomeAndExpensePerMonth(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT
  DATE_TRUNC('month', date) AS month,
  COALESCE(SUM(CASE WHEN operation_amount > 0 THEN operation_amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN operation_amount < 0 THEN operation_amount ELSE 0 END), 0) AS total_expense,
  COALESCE(SUM(CASE WHEN operation_amount > 0 THEN operation_amount ELSE 0 END), 0) +
  COALESCE(SUM(CASE WHEN operation_amount < 0 THEN operation_amount ELSE 0 END), 0) AS net_income
FROM
  (SELECT date_of_operation AS date, operation_amount FROM dbo.transactions WHERE status != 'FAILED'
   UNION ALL
   SELECT DATE_TRUNC('month', NOW() AT TIME ZONE 'Europe/Moscow'), 0) subquery
GROUP BY month
ORDER BY month DESC
`
    )

    res.json(rows)
  } catch (error) {
    console.error('Error while fetching income and expense per month:', error)
    res.status(500).send(error.message)
  }
}

// Функция для получения транзакций за текущий месяц
async function getTransactionsForMonthAndYear(req, res) {
  try {
    const year = req.params.year
    const month = req.params.month

    const firstDayOfMonth = new Date(year, month - 1, 1)
    const lastDayOfMonth = new Date(year, month, 0)

    const { rows } = await pool.query(
      `SELECT transaction_id, date_of_operation, date_of_payment, card_number, status,
              operation_amount::float AS operation_amount, operation_currency, payment_amount::float AS payment_amount, payment_currency,
              cashback, category, mcc, description, bonuses, rounding, total_amount_with_rounding
       FROM dbo.transactions
       WHERE date_of_operation >= $1 AND date_of_operation <= $2
         AND description <> 'Перевод между счетами'
       ORDER BY date_of_operation`,
      [firstDayOfMonth, lastDayOfMonth]
    )

    const filteredRows = rows.filter((row, index, array) => {
      for (let i = 0; i < array.length; i++) {
        if (i !== index) {
          const diffTime = Math.abs(
            new Date(row.date_of_operation) -
              new Date(array[i].date_of_operation)
          )
          const diffMinutes = diffTime / (1000 * 60)
          if (
            diffMinutes <= 30 &&
            row.operation_amount === -array[i].operation_amount
          ) {
            return false
          }
        }
      }
      return true
    })

    res.json(filteredRows)
  } catch (error) {
    console.error('Error while fetching transactions:', error)
    res.status(500).send(error.message)
  }
}

async function getAvailableYearsAndMonths(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT EXTRACT(YEAR FROM date_of_operation) AS year, EXTRACT(MONTH FROM date_of_operation) AS month
       FROM dbo.transactions
       GROUP BY year, month
       ORDER BY year DESC, month DESC`
    )

    const result = rows.reduce((acc, { year, month }) => {
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(month)
      return acc
    }, {})

    res.json(result)
  } catch (error) {
    console.error('Error while fetching available years and months:', error)
    res.status(500).send(error.message)
  }
}

async function getAllTransactions(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT transaction_id, date_of_operation, date_of_payment, card_number, status,
              operation_amount, operation_currency, payment_amount, payment_currency,
              cashback, category, mcc, description, bonuses, rounding, total_amount_with_rounding
       FROM dbo.transactions
       ORDER BY date_of_operation DESC`
    )
    res.json(rows)
  } catch (error) {
    console.error('Error while fetching all transactions:', error)
    res.status(500).send(error.message)
  }
}
// main
async function getChartForMonthAndYear(req, res) {
  try {
    const year = req.params.year
    const month = req.params.month

    const firstDayOfMonth = new Date(year, month - 1, 1)
    const lastDayOfMonth = new Date(year, month, 0)

    const { rows } = await pool.query(
      `SELECT EXTRACT(DAY FROM date_of_operation) as day, SUM(operation_amount) as total
       FROM dbo.transactions
       WHERE date_of_operation >= $1
         AND date_of_operation <= $2
         AND description <> 'Перевод между счетами'
       GROUP BY EXTRACT(DAY FROM date_of_operation)
       ORDER BY day`,
      [firstDayOfMonth, lastDayOfMonth]
    )

    const chartData = rows.map((row) => ({
      name: row.day.toString(),
      pl: row.total,
    }))

    res.json(chartData)
  } catch (error) {
    console.error('Error while fetching chart data:', error)
    res.status(500).send(error.message)
  }
}

// добавьте соответствующий маршрут

module.exports = {
  getIncomeAndExpensePerMonth,
  getTransactionsForMonthAndYear,
  getAvailableYearsAndMonths,
  getChartForMonthAndYear,
  getAllTransactions,
}
