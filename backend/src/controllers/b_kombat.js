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

async function getKombat(req, res) {
  try {
    const query = `
SELECT DISTINCT ON (k.name)
k.name,
k.level,
k.price,
k.profit,
k.location,
k.img,
k.price::FLOAT / NULLIF(k.profit, 0) AS price_profit_ratio
FROM
"dbo"."kombat" k
INNER JOIN (
    SELECT
    name,
    MAX(level) AS max_level
    FROM
    "dbo"."kombat"
    GROUP BY
    name
) km ON k.name = km.name AND k.level = km.max_level
ORDER BY
k.name,
price_profit_ratio;
`

    const { rows } = await pool.query(query)

    // Так как ответ уже будет соответствовать ожидаемому формату, нет нужды в повторном форматировании
    res.json(rows)
  } catch (error) {
    console.error('Error while fetching Kombat details:', error)
    res.status(500).send(error.message)
  }
}

async function addKombat(req, res) {
  const { year, month } = req.params

  try {
    const query = `
      SELECT
        COALESCE(SUM(CASE WHEN operation_amount > 0 THEN operation_amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN operation_amount < 0 THEN ABS(operation_amount) ELSE 0 END), 0) AS total_expense,
        (COALESCE(SUM(operation_amount), 0)) AS net_profit
      FROM
        dbo.transactions
      WHERE
        EXTRACT(YEAR FROM date_of_operation) = $1 AND
        EXTRACT(MONTH FROM date_of_operation) = $2 AND
        description <> 'Перевод между счетами' AND
        status <> 'FAILED'
    `

    const { rows } = await pool.query(query, [year, month])

    if (rows.length > 0) {
      const row = rows[0]
      res.json({
        year,
        month,
        total_income: parseFloat(row.total_income).toFixed(2),
        total_expense: parseFloat(row.total_expense).toFixed(2),
        net_profit: parseFloat(row.net_profit).toFixed(2),
      })
    } else {
      res.json({
        year,
        month,
        total_income: '0.00',
        total_expense: '0.00',
        net_profit: '0.00',
      })
    }
  } catch (error) {
    console.error('Error while fetching income, expense, and profit:', error)
    res.status(500).send(error.message)
  }
}

// Функция для получения транзакций за текущий месяц

// добавьте соответствующий маршрут

module.exports = {
  getKombat,
  addKombat,
}
