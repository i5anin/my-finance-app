const { Pool } = require('pg')
const xlsx = require('node-xlsx').default
const { getNetworkDetails } = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig =
  networkDetails.databaseType === 'build'
    ? config.dbConfig
    : config.dbConfigTest

const pool = new Pool(dbConfig)

async function createAndInsertTransactionsFromXLS() {
  const filePath = 'S:\\development\\finance\\backend\\operations.xls'
  try {
    // Определение и создание таблицы transactions
    await pool.query(`
      DROP TABLE IF EXISTS dbo.transactions;
      CREATE TABLE dbo.transactions (
        transaction_id SERIAL PRIMARY KEY,
        date_of_operation TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        date_of_payment TIMESTAMP WITHOUT TIME ZONE,
        card_number VARCHAR(255),
        status VARCHAR(50),
        operation_amount NUMERIC(10, 2) NOT NULL,
        operation_currency VARCHAR(3) NOT NULL,
        payment_amount NUMERIC(10, 2) NOT NULL,
        payment_currency VARCHAR(3) NOT NULL,
        cashback NUMERIC(10, 2),
        category VARCHAR(255),
        mcc VARCHAR(255),
        description TEXT,
        bonuses NUMERIC(10, 2),
        rounding NUMERIC(10, 2),
        total_amount_with_rounding NUMERIC(10, 2) NOT NULL
      );
    `)
    console.log('Table created successfully.')

    // Путь к файлу XLS
    const workSheets = xlsx.parse(filePath)
    const data = workSheets[0].data
    data.shift() // Удаление заголовков столбцов

    // Вставка данных в таблицу transactions
    for (let i = 0; i < data.length; i++) {
      let row = data[i]
      // Проверка и обработка пустых значений для столбцов NOT NULL
      row = row.map((cell) => (cell !== null ? cell : '')) // Замените пустые ячейки на пустую строку или другое значение по умолчанию

      const query = `INSERT INTO dbo.transactions (
        date_of_operation, date_of_payment, card_number, status, operation_amount,
        operation_currency, payment_amount, payment_currency, cashback, category,
        mcc, description, bonuses, rounding, total_amount_with_rounding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`

      await pool.query(query, row)
      console.log(`Inserted row ${i + 1} of ${data.length}`)
    }
    console.log('Transactions inserted successfully.')
  } catch (error) {
    console.error(
      'Error while creating table and inserting transactions:',
      error
    )
  }
}

module.exports = {
  createAndInsertTransactionsFromXLS,
}
