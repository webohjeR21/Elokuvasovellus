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

export default ApiHaku;
