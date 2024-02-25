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
        CREATE TABLE dbo.transactions
        (
            transaction_id             SERIAL PRIMARY KEY,
            date_of_operation          TIMESTAMP WITHOUT TIME ZONE, --Дата операции
            date_of_payment            TIMESTAMP WITHOUT TIME ZONE, --Дата платежа
            card_number                VARCHAR(255),                --Номер карты
            status                     VARCHAR(50),                 --Статус
            operation_amount           NUMERIC(15, 2),              --Сумма операции
            operation_currency         VARCHAR(3),                  --Валюта операции
            payment_amount             NUMERIC(15, 2),              --Сумма платежа
            payment_currency           VARCHAR(3),                  --Валюта платежа
            cashback                   NUMERIC(15, 2),              --Кэшбэк
            category                   VARCHAR(255),                --Категория
            mcc                        VARCHAR(255),                --MCC
            description                TEXT,                        --Описание
            bonuses                    NUMERIC(15, 2),              --Бонусы (включая кэшбэк)
            rounding                   NUMERIC(15, 2),              --Округление на инвесткопилку
            total_amount_with_rounding NUMERIC(15, 2)               --Сумма операции с округлением
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
      row = row.map((cell) => (cell !== null ? cell : '')) // Обработка пустых значений

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

async function updateTransactionsFromXLS() {
  const filePath = 'S:\\development\\finance\\backend\\operations.xls'
  try {
    // Получение даты последней операции в таблице
    const { rows } = await pool.query(
      'SELECT MAX(date_of_operation) as last_date FROM dbo.transactions'
    )
    const lastDateInDB = rows[0]?.last_date || new Date(0) // Если в таблице нет записей, используем очень старую дату

    // Чтение данных из файла XLS
    const workSheets = xlsx.parse(filePath)
    const data = workSheets[0].data
    data.shift() // Удаление заголовков столбцов

    let newRecordsCount = 0

    // Вставка только новых данных в таблицу transactions
    for (let i = 0; i < data.length; i++) {
      let row = data[i]
      const dateOfOperation = new Date(row[0]) // Предполагается, что дата операции находится в первом столбце

      // Вставляем запись только если она новее последней записи в базе
      if (dateOfOperation > lastDateInDB) {
        row = row.map((cell) => (cell !== null ? cell : '')) // Обработка пустых значений

        const query = `INSERT INTO dbo.transactions (
          date_of_operation, date_of_payment, card_number, status, operation_amount,
          operation_currency, payment_amount, payment_currency, cashback, category,
          mcc, description, bonuses, rounding, total_amount_with_rounding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`

        await pool.query(query, row)
        console.log(`Inserted row ${i + 1} of ${data.length}`)
        newRecordsCount++
      }
    }

    if (newRecordsCount > 0) {
      console.log(`${newRecordsCount} new transactions inserted successfully.`)
    } else {
      console.log('No new transactions to insert.')
    }
  } catch (error) {
    console.error('Error while updating transactions:', error)
  }

  console.log('Transaction update process completed.')
}

module.exports = {
  createAndInsertTransactionsFromXLS,
  updateTransactionsFromXLS,
}
