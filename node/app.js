const { fetchData } = require('./postgre');

//esimerkki
var query = 'SELECT * FROM asiakkaat;';
(async () => {
  try {
    const result = await fetchData(query);
    console.log(result);
  } catch (error) {
    console.error('Virhe: ', error);
  }
})();
