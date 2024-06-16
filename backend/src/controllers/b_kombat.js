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
WITH ranked_kombat AS (
  SELECT
    k.name,
    k.level,
    k.price,
    k.profit,
    k.location,
    k.img,
    k.total_price,
    k.price::FLOAT / NULLIF(k.profit, 0) AS price_profit_ratio,
    (k.profit::FLOAT / NULLIF(k.total_price, 0)) * 100 AS percentage,
    ROW_NUMBER() OVER(
      PARTITION BY k.name
      ORDER BY k.level DESC, k.price::FLOAT / NULLIF(k.profit, 0) ASC
    ) AS rank
  FROM
    "dbo"."kombat" k
)
SELECT
  name,
  level,
  price,
  profit,
  location,
  img,
  total_price,
  price_profit_ratio,
  percentage
FROM
  ranked_kombat
WHERE
  rank = 1
ORDER BY
  price_profit_ratio ASC;
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
  const {
    profit,
    price,
    name,
    location: initialLocation,
    img,
    level: initialLevel,
    order,
    total_price,
  } = req.body

  try {
    let finalLevel = initialLevel // Окончательный уровень
    let finalLocation = initialLocation // Окончательное местоположение

    // Проверяем, указан ли уровень и местоположение
    if (
      finalLevel === null ||
      finalLevel === undefined ||
      finalLocation === null ||
      finalLocation === undefined
    ) {
      // Запрос для нахождения максимального уровня и местоположения с таким же именем
      const existingRecordQuery = `SELECT level, location
        FROM "dbo"."kombat"
        WHERE name = $1
        ORDER BY level DESC
        LIMIT 1;`

      const { rows: existingRows } = await pool.query(existingRecordQuery, [
        name,
      ])

      // Если найдена запись, обновляем уровень на +1 и местоположение, если они не были указаны
      if (existingRows.length > 0) {
        const existingRow = existingRows[0]
        finalLevel = finalLevel ?? existingRow.level + 1
        finalLocation = finalLocation ?? existingRow.location
      } else {
        // Если запись с таким именем не найдена, устанавливаем уровень и местоположение по умолчанию
        finalLevel = finalLevel ?? 1 // Установите ваше значение по умолчанию для уровня
        finalLocation = finalLocation ?? 'Default Location' // Установите ваше значение по умолчанию для местоположения
      }
    }

    // Запрос на добавление записи
    const insertQuery = `
    INSERT INTO "dbo"."kombat" (profit, price, name, location, img, level, "order", total_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `

    // Выполнение запроса и получение результата
    const { rows } = await pool.query(insertQuery, [
      profit,
      price,
      name,
      finalLocation,
      img,
      finalLevel,
      order,
      total_price,
    ])

    // Отправка добавленной записи клиенту
    res.json(rows[0])
  } catch (error) {
    console.error('Ошибка при добавлении записи Kombat:', error)
    res.status(500).send(error.message)
  }
}

async function getUniqueNamesAndLocations(req, res) {
  try {
    // SQL запрос для выбора уникальных названий и расположений
    const query = `
SELECT DISTINCT name, location
FROM "dbo"."kombat"
ORDER BY name, location;
`
    const { rows } = await pool.query(query)

    // Группировка данных по name и location
    const names = new Set() // Используем Set для уникальных значений
    const locations = new Set() // Используем Set для уникальных значений

    rows.forEach((row) => {
      names.add(row.name)
      locations.add(row.location)
    })

    // Преобразование Set в массив
    const uniqueNames = Array.from(names)
    const uniqueLocations = Array.from(locations)

    // Отправляем уникальные названия и расположения клиенту
    res.json({ names: uniqueNames, locations: uniqueLocations })
  } catch (error) {
    console.error(
      'Ошибка при получении уникальных названий и расположений:',
      error
    )
    res.status(500).send(error.message)
  }
}

// Добавьте эту функцию в экспорты модуля, чтобы она была доступна для использования.
module.exports = {
  getKombat,
  addKombat,
  getUniqueNamesAndLocations,
}
