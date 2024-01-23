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

    console.log(year, month)

    const firstDayOfMonth = new Date(year, month - 1, 1)
    const lastDayOfMonth = new Date(year, month, 0)

    const { rows } = await pool.query(
      `SELECT *
       FROM dbo.transactions
       WHERE timestamp >= $1
         AND timestamp <= $2
       ORDER BY timestamp DESC`,
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
      `SELECT EXTRACT(YEAR FROM timestamp) AS year, EXTRACT(MONTH FROM timestamp) AS month
       FROM dbo.transactions
       GROUP BY year, month
       ORDER BY year DESC, month DESC`
    )

    const result = rows.reduce((acc, { year, month }) => {
      // Находим индекс объекта с текущим годом в аккумуляторе
      const yearIndex = acc.findIndex((item) => item.yeart === year)

      // Если год уже есть в аккумуляторе, добавляем месяц к существующему объекту
      if (yearIndex > -1) {
        acc[yearIndex].mounth.push(month)
      } else {
        // Если года нет, создаем новый объект с годом и месяцем
        acc.push({ yeart: year, mounth: [month] })
      }

      return acc
    }, [])

    res.json(result)
  } catch (error) {
    console.error('Error while fetching available years and months:', error)
    res.status(500).send(error.message)
  }
}

async function getAllTransactions(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM dbo.transactions ORDER BY timestamp DESC`
    )
    res.json(rows)
  } catch (error) {
    console.error('Error while fetching all transactions:', error)
    res.status(500).send(error.message)
  }
}

// добавьте соответствующий маршрут

module.exports = {
  getTransactionsForMonthAndYear,
  getAllTransactions,
  getAvailableYearsAndMonths,
}
