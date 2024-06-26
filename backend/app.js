const { fetchData } = require('./postgre');
const express = require('express');
const axios = require('axios');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.static('public'));
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const session = require('express-session');
//app.use('/auth')
//POSTGRES CLIENT
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { use } = require('chai');
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
      const result = await client.query('SELECT * FROM asiakkaat WHERE uname = $1', [userUname]);
      if (result.rows.length === 0) {
        
        console.log('Käyttäjää ei löytynyt: ', userUname);
        return res.status(404).json({ error: 'Käyttäjää ei löydy.' }); 
      }

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
    res.status(401).json({ error: 'joku meni pieleen' });
  }
});

//IMDB HAKU
app.get('/imdb', async (req, res) => {
  try {

    //parametrit
    const { i } = req.query;
    //url
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiAvain}&i=${i}&plot=short`;
    const response = await axios.get(apiUrl);
    //vastaus
    res.json(response.data);
    console.log('Suoritettiin api kutsu ', apiIndex, '. ID: ', i, ', ', new Date );
    apiIndex++;

  } catch (error) {
    console.error('joku meni pieleen', error);
    res.status(401).json({ error: 'joku meni pieleen' });
  }
});

app.listen(PORT, async function () {
  console.log('kuuntelee porttia ' + PORT);
})

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));


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
      console.log("Token generated for username:", username);
      console.log("Salasanat täsmää");
      const token = jwt.sign({username: username}, process.env.JWT_SECRET, {
        expiresIn: 300, 
      })
      req.session.asiakkaat = result
      res.json({auth: true, token, user: {username: username}})
      
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


  //Salasana vaihto
  app.post('/password-change', async (req, res) => {
    const { newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[0];

    try {
      const avoinToken = jwt.verify(token, process.env.JWT_SECRET);
      const username = avoinToken.username;
      const newHash = await bcrypt.hash(newPassword, saltRounds);
      await client.query("UPDATE asiakkaat SET passwd = $1 WHERE uname = $2", [newHash, username]);
      console.log(username, "uusi salasana:", newPassword);
      return res.status(200).json({ message: "Salasann päivittäminen onnistui" });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //IMDB ARVOSTELU
  app.post('/imdbsubmit', async (req, res) => {
    const { asiakas, arvosana, arvostelu, imdbID } = req.body;
    console.log(asiakas);
    try {
      const vastaus = await client.query("INSERT INTO arvostelut(create_time, asiakas, arvosana, imdbid, arvostelu) VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4);", [asiakas, arvosana, imdbID, arvostelu]);
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data:', error.message);
      res.status(500).json({ success: false, error: error.message }); 
    }
  });

  //Tarkista login
  app.post('/tarkista-login', async (req, res) => {
    const { clientUsername } = req.body;
    const token = req.headers.authorization?.split(' ')[0];
    if (!clientUsername || !token){
      return res.status(202).json({ message: "Ei kirjattu sisään "});
    }
    try {
      const avoinToken = jwt.verify(token, process.env.JWT_SECRET);
      const username = avoinToken.username;

      if (username){
        console.log(username, "on kirjautunut");
        return res.status(200).json({ message: "Kirjautunut sisään" });
      } else {
        console.log(clientUsername, "ei ole kirjautunut");
        return res.status(201).json({ message: "Ei kirjattu sisään "});
      }
    } catch (error) {
      console.log("vanhentunut tai ei kirjattu");
      return res.status(201).json({ message: "vanhentunut tai ei kirjattu" });

    }
  });
  

