import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Arvostelu.css';
import Api from './ApiHaku';
import axios from 'axios';

const Arvostelulomake = () => {
  const { imdbID } = useParams();
  const [lomakeData, setLomakeData] = useState({
    käyttäjänimi: '',
    arvosana: '',
    imdbID: imdbID,
    arvostelu: ''
  });
  const [elokuvanTiedot, setElokuvanTiedot] = useState(null); 

  useEffect(() => {
    async function haeElokuvanTiedot() {
      try {
        const elokuvaData = await Api.ApiHakuImdb(imdbID);
        setElokuvanTiedot(elokuvaData);
      } catch (error) {
        console.error('Virhe elokuvatietoja haettaessa:', error);
      }
    }
    haeElokuvanTiedot();
  }, [imdbID]);

  const muutaTietoja = event => {
    const { name, value } = event.target;
    setLomakeData({
      ...lomakeData,
      [name]: value
    });
  };

  const lähetäLomake = async event => {
    event.preventDefault();

    try {
      const vastaus = await axios.post('http://localhost:3001/imdbsubmit', lomakeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (vastaus.status !== 200) {
        throw new Error('Lähetys epäonnistui');
      }

      alert('Arvostelu lähetetty onnistuneesti!');
      setLomakeData({
        //käyttäjänimi: '',
        arvosana: '',
        imdbID: imdbID,
        arvostelu: ''
      });
    } catch (error) {
      console.error('Virhe:', error);
      alert('Lähetys epäonnistui.');
    }
  };

  return (
    <div className="Arvostelulomake">
      <h1>Lähetä arvostelu</h1>
      {elokuvanTiedot && (
        <div className='elokuvan-tiedot'>
          <h2>Elokuvan tiedot</h2>
          <img src={elokuvanTiedot.Poster}></img>
          <p>Nimi: {elokuvanTiedot.Title}</p>
          <p>Vuosi: {elokuvanTiedot.Year}</p>
        </div>
      )}
      <form onSubmit={lähetäLomake}>
        <label htmlFor="käyttäjänimi">Käyttäjänimi:</label>
        <input type="text" id="käyttäjänimi" name="käyttäjänimi" value={lomakeData.käyttäjänimi} onChange={muutaTietoja} required /><br /><br />

        <label htmlFor="arvosana">Arvosana:</label>
        <select id="arvosana" name="arvosana" value={lomakeData.arvosana} onChange={muutaTietoja} required>
          <option value="">Arvosana</option>
          {[1, 2, 3, 4, 5].map(arvosana => (
            <option key={arvosana} value={arvosana}>{arvosana}</option>
          ))}
        </select><br /><br />

        <label htmlFor="arvostelu">Arvostelu:</label><br />
        <textarea id="arvostelu" name="arvostelu" value={lomakeData.arvostelu} onChange={muutaTietoja} rows="4" cols="50" required></textarea><br /><br />

        <button type="submit">Lähetä</button>
      </form>
    </div>
  );
};

export default Arvostelulomake;
