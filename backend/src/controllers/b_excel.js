const { Pool } = require('pg')
const xlsx = require('node-xlsx').default
const config = require('../config')

const pool = new Pool(config.dbConfig)

async function insertTransactionsFromXLS() {
  try {
    // Путь к файлу XLS
    const filePath = '../../operations.xls'
    const workSheets = xlsx.parse(filePath)
    const data = workSheets[0].data // Предполагаем, что данные находятся на первом листе
    data.shift() // Удалить заголовки столбцов, если они есть

    const insertQueries = data.map((row) => {
      // Предполагается, что столбцы соответствуют вашей таблице transactions
      const query = `INSERT INTO dbo.transactions (date_of_operation, date_of_payment, card_number, status, operation_amount, operation_currency, payment_amount, payment_currency, cashback, category, mcc, description, bonuses, rounding, total_amount_with_rounding)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`
      // Здесь row — это массив значений из каждой строки файла XLS
      return pool.query(query, row)
    })

    await Promise.all(insertQueries)
    console.log('Transactions inserted successfully')
  } catch (error) {
    console.error('Error while inserting transactions from XLS:', error)
  }
}

// Вызов функции
module.exports = {
  insertTransactionsFromXLS,
}
