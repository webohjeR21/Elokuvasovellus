const { fetchData } = require('./postgre');
const express = require('express');
const app = express();
app.use(express.static('public'));
require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json())

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates (only for development/testing)
  }
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

const PORT = 3001;

app.post('/register', (req, res) => {
 
 const username = req.body.username
 const password = req.body.password
 const email = req.body.email
 
  Database.query("INSERT INTO asiakkaat(uname, passwd, email) VALUES (?,?,?)", [username, password, email], (err, result) => {
    console.log(err);
  })
})

app.listen(PORT, async function () {
  console.log('kuuntelee porttia ' + PORT);
})




//esimerkki
/*
var query = 'SELECT * FROM asiakkaat;';
(async () => {
  try {
    const result = await fetchData(query);
    console.log(result);
  } catch (error) {
    console.error('Virhe: ', error);
  }
})();*/
