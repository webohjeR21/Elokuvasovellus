const path = require('path');
const dotenv = require('dotenv').config({
  override: true,
  path: path.join(__dirname, '.env')
});
const { Pool } = require('pg');

async function fetchData(query) {
  //yhdistää tietokantaan.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL + '?ssl=true'
  });

  let client;
  //hakee tiedon
  try {
    client = await pool.connect();
    var { rows } = await client.query(query);
  } catch (err) {
    console.error('Virhe:', err);
    throw err;
  } finally {
    //sulkee yhteyden ja palauttaa tuloksen
    if (client) {
      client.release();
    }
    return rows;
  }
}

module.exports = { fetchData };