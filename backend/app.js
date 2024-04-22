const { fetchData } = require('./postgre');
const express = require('express');
const axios = require('axios');
//const auth = require('.auth/')
const app = express();
app.use(express.static('public'));
require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json());
//app.use('/auth')

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

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

const PORT = 3001;

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


  //Elokuvien haku
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

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
     console.log("Login yritys", username);
  
    if (!username) {
      return res.status(400).json({error: "Username cannot be null or empty"})
    }
  
    try {
      //kokeile onko salasana ja käyttäjänimi oikein
      const result = await client.query("SELECT passwd FROM asiakkaat WHERE uname = $1", [username]);
      const hashPwd = result.rows[0].passwd;
      const hashMatch = await bcrypt.compare(password, hashPwd);

      if (hashMatch) {
        console.log("toimii jeejee");
      }
  
      } catch (err) {
        console.error('Error login:', err.message);
      res.status(500).json({ error: "Internal Server Error" });
      }
      
    })
