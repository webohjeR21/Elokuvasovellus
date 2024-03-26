const { fetchData } = require('./postgre');
const express = require('express');
const app = express();
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());

const PORT = 3001;

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
