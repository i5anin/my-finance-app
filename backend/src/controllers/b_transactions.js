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

// Функция для получения транзакций за текущий месяц
async function getTransactionsForMonthAndYear(req, res) {
  try {
    const year = req.params.year
    const month = req.params.month

    const firstDayOfMonth = new Date(year, month - 1, 1)
    const lastDayOfMonth = new Date(year, month, 0)

    const { rows } = await pool.query(
      `SELECT transaction_id, date_of_operation, date_of_payment, card_number, status,
              operation_amount, operation_currency, payment_amount, payment_currency,
              cashback, category, mcc, description, bonuses, rounding, total_amount_with_rounding
       FROM dbo.transactions
       WHERE date_of_operation >= $1 AND date_of_operation <= $2
         AND description <> 'Перевод между счетами'
       ORDER BY date_of_operation DESC`,
      [firstDayOfMonth, lastDayOfMonth]
    )

    res.json(rows)
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
  getTransactionsForMonthAndYear,
  getAllTransactions,
  getAvailableYearsAndMonths,
  getChartForMonthAndYear,
}
