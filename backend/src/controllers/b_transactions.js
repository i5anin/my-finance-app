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
async function getTransactionsForCurrentMonth(req, res) {
  try {
    const currentDate = new Date()
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    )

    const { rows } = await pool.query(
      `SELECT *
       FROM dbo.transactions
       WHERE timestamp >= $1
         AND timestamp <= $2`,
      [firstDayOfMonth, lastDayOfMonth]
    )

    res.json(rows)
  } catch (error) {
    console.error('Error while fetching transactions:', error)
    res.status(500).send(error.message)
  }
}

async function getAllTransactions(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM dbo.transactions`)
    res.json(rows)
  } catch (error) {
    console.error('Error while fetching all transactions:', error)
    res.status(500).send(error.message)
  }
}

// добавьте соответствующий маршрут

module.exports = {
  getTransactionsForCurrentMonth,
  getAllTransactions,
}
