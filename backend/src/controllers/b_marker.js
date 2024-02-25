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
const myCustomMarker = async (req, res) => {
  try {
    const sqlQuery = `
            UPDATE transactions
            SET
                my_comment = CASE
                    WHEN description LIKE '%Ирина К.%' THEN 'Курсы по ораторскому искусству'
                    WHEN description LIKE '%Артем З.%' THEN 'Курсы по программированию'
                    WHEN description = 'Animaciya' THEN 'Алмаз'
                    WHEN description LIKE '%Елена Р.%' THEN 'Парикмахерская'
                    ELSE my_comment
                END,
                my_category = CASE
                    WHEN description LIKE '%Ирина К.%' THEN 'Курсы'
                    WHEN description LIKE '%Артем З.%' THEN 'Курсы'
                    WHEN operation_amount = -4500 AND description = 'Gus-Khrustalnyjj' AND category = 'Красота' THEN 'Тренажерный зал'
                    WHEN description LIKE '%Елена Р.%' THEN 'Красота'
                    ELSE my_category
                END
            WHERE
                description LIKE '%Ирина К.%' OR
                description LIKE '%Артем З.%' OR
                description = 'Animaciya' OR
                (operation_amount = -4500 AND description = 'Gus-Khrustalnyjj' AND category = 'Красота') OR
                description LIKE '%Елена Р.%';
        `

    await pool.query(sqlQuery)
    res.send('Транзакции успешно обновлены')
  } catch (err) {
    console.error(err)
    res.status(500).send('Ошибка при обновлении транзакций')
  }
}

// добавьте соответствующий маршрут

module.exports = {
  myCustomMarker,
}
