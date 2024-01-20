const { Pool } = require('pg')
const { getNetworkDetails } = require('../db_type')
const config = require('../config')
const faker = require('faker')

const networkDetails = getNetworkDetails()
const dbConfig =
  networkDetails.databaseType === 'build'
    ? config.dbConfig
    : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

async function fillTransactionsWithRandomData(req, res) {
  try {
    const insertQueries = []
    for (let i = 0; i < 10; i++) {
      // Генерация 100 записей
      const amount = faker.random.number({ min: -10000, max: 10000 }) // Случайное значение от -10000 до 10000
      const comment = faker.lorem.sentence()
      const category = faker.commerce.productName() // Используйте подходящую категорию
      const timestamp = faker.date.recent(90).toISOString() // Дата за последние 90 дней

      const query = `INSERT INTO dbo.transactions (amount, comment, category, timestamp)
                           VALUES (${amount}, '${comment}', '${category}', '${timestamp}')`
      insertQueries.push(pool.query(query))
    }

    await Promise.all(insertQueries)
    res.send('Random data inserted successfully')
  } catch (error) {
    console.error('Error while inserting random transactions:', error)
    res.status(500).send(error.message)
  }
}

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
  fillTransactionsWithRandomData,
}
