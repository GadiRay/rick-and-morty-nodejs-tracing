const { Pool } = require('pg');

// create new pool for psql
const CONFIG = {
    password: 'postgres',
    user: 'postgres',
    database: 'postgres',
    host: 'localhost',
    port: 5432
};

function initDb() {
    const pool = new Pool(CONFIG);

    pool.connect((connectErr, client, release) => {
        if (connectErr) throw connectErr;
        release();
        const queryText = 'CREATE TABLE IF NOT EXISTS characters(id SERIAL PRIMARY KEY, name VARCHAR(100) not null)';
        client.query(queryText, (err, res) => {
            if (err) throw err;
        });
        const insertQuery = {
            text: 'INSERT INTO characters (id, name) VALUES($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10) ON CONFLICT(id) DO NOTHING',
            values: [1, 'Rick Sanchez', 2, 'Morty Smith', 3, 'Summer Smith', 4, 'Beth Smith', 5, 'Jerry Smith' ]
        };
        client.query(insertQuery, (err, res) => {
            if (err) throw err;
        });
    });

    return pool;
}

module.exports = initDb;
