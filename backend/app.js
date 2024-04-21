const { fetchData } = require('./postgre');
const express = require('express');
//const auth = require('.auth/')
const app = express();
app.use(express.static('public'));
require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json())
//app.use('/auth')

const { Client } = require('pg');
const bcrypt = require('bcrypt')
const saltRounds = 10



app.use(express.urlencoded({ extended: true }));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

const PORT = 3000;

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;


   // Logging received data
   console.log("Received username:", username);
   console.log("Received password:", password);
   console.log("Received email:", email);
 

  if (!username) {
    return res.status(400).json({error: "Username cannot be null or empty"})
  }

  try {
    // Testaa onko käyttäjä jo olemassa
    const existingUser = await client.query("SELECT * FROM asiakkaat WHERE uname = $1 OR email = $2", [username, email]);
   
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Salasanan hashaus


  
      const hash = await bcrypt.hash(password, saltRounds);

      const result = await client.query("INSERT INTO asiakkaat(uname, passwd, email) VALUES ($1, $2, $3)", [username, hash, email])
      console.log("User registered:", username);
      res.status(200).json({ message: "User registered successfully" })
    } catch (err) {
      console.error('Error registering user:', err.message);
    res.status(500).json({ error: "Internal Server Error" })
      // handle error
    }
    
  })
  app.delete('/asiakkaat/:uname', async (req, res) => {
    const userUname = req.params.uname;
    try {
      // Check if the user exists before attempting to delete
      const result = await client.query('SELECT * FROM asiakkaat WHERE uname = $1', [userUname]);
      if (result.rows.length === 0) {
        // User does not exist, return 404
        console.log('Käyttäjää ei löytynyt: ', userUname);
        return res.status(404).json({ error: 'Käyttäjää ei löydy.' });
      }
  
      // User exists, proceed with deletion
      await client.query('DELETE FROM asiakkaat WHERE uname = $1', [userUname]);
      console.log('Käyttäjä poistettu: ', userUname);
      res.status(200).json({ message: 'Käyttäjä poistettu.' });
    } catch (error) {
      console.error('Virhe käyttäjän poistossa:', error);
      res.status(500).json({ error: 'Käyttäjän poistossa tapahtui virhe.' });
    }
  });

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
})(); */ 

