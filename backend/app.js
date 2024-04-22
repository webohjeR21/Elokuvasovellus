const { fetchData } = require('./postgre');
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.static('public'));
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());
//app.use('/auth')
//POSTGRES CLIENT

const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const apiAvain = process.env.API_KEY;
var apiIndex = 0;



app.use(express.urlencoded({ extended: true }));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

//POSTGRES CONNECT
client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

const PORT = 3001;


//REGISTER
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


//HAKU
app.get('/haku', async (req, res) => {
  try {

    //parametrit
    const { s, y, type, page } = req.query;
    //url
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiAvain}&s=${s}&y=${y}&type=${type}&page=${page}`;
    const response = await axios.get(apiUrl);
    //vastaus
    res.json(response.data);
    console.log('Suoritettiin api kutsu ', apiIndex, '. haku: ', s, ', sivu: ', page, ' vuosi: ', y, ' tyyppi: ', type, new Date );
    apiIndex++;

  } catch (error) {
    console.error('joku meni pieleen', error);
    res.status(1).json({ error: 'joku meni pieleen' });
  }
});

app.listen(PORT, async function () {
  console.log('kuuntelee porttia ' + PORT);
})


//LOGIN
app.post('/login', async (req, res) => {

  const { username, password } = req.body;
  console.log("Login yritys", username);

  if (!username) {
    return res.status(400).json({error: "Username cannot be null or empty"})
  }

  try {
    
    //kokeile onko salasana ja käyttäjänimi oikein
    const result = await client.query("SELECT passwd FROM asiakkaat WHERE uname = $1", [username]);

    if (result.rows.length < 1){
      console.log('Käyttäjää ei ole olemassa');
      return res.status(401).json({ error: "Käyttäjänimeä ei löydy" });
    }

    const hashPwd = result.rows[0].passwd;
    const hashMatch = await bcrypt.compare(password, hashPwd);

    if (hashMatch) {
      console.log("Salasanat täsmää");
      return res.status(200).json("Oikein");
    } 

    else {
      console.log('Salasanat ei täsmää');
      return res.status(401).json({ error: "Salasana väärin" });
    }

  } catch (erro) {
    console.error('Eroor: ', erro);
    return res.status(500).json({ error: "Palvelin error" });
  }
    
  })
