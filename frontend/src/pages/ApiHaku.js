import axios from 'axios';

async function ApiHaku(hakuTermi, valittuVuosi, valittuTyyppi, valittuSivu) {

  const baseUrl = 'http://localhost:3001/haku/';
  const params = new URLSearchParams({

    s: hakuTermi,
    y: valittuVuosi || '',
    type: valittuTyyppi || '',
    page: valittuSivu || ''
    
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('err');
  }
}

async function ApiHakuImdb(imdbID) {

  const baseUrl = 'http://localhost:3001/imdb/';
  const params = new URLSearchParams({
    i: imdbID,
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('err');
  }
}

async function TarkistaToken(){
  const Username = localStorage.getItem('username');
  const BearerToken = localStorage.getItem('token');

  try {
    const response = await axios.post('http://localhost:3001/tarkista-login', { clientUsername: Username, }, { headers: { 'Authorization':BearerToken },})
    if (response.status === 200){
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {ApiHaku, ApiHakuImdb, TarkistaToken};
