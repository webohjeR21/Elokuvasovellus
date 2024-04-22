import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Delete.css';

const Delete = () => {
  const [username, setUsername] = useState('');

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const confirmDelete = () => {
    Swal.fire({
      icon: 'info',
      title: 'Poista käyttäjä',
      text: 'Haluatko varmasti poistaa tämän käyttäjän?',
      showCancelButton: true,
      confirmButtonText: 'Kyllä',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser();
      }
    });
  };

  const deleteUser = () => {
    if (!username) {
      Swal.fire({
        icon: 'error',
        title: 'Virhe',
        text: 'Syötä käyttäjänimi.',
      });
      return;
    }

    fetch(`http://localhost:3001/asiakkaat/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Käyttäjä poistettu');
          Swal.fire({
            icon: 'success',
            title: 'Käyttäjä poistettu',
            text: 'Käyttäjä poistettu onnistuneesti.',
          });
          setUsername('');
        } else if (response.status === 404) {
          // Handle case where user does not exist
          Swal.fire({
            icon: 'error',
            title: 'Virhe',
            text: 'Käyttäjää ei löydy. Tarkista käyttäjänimi ja yritä uudelleen.',
          });
        } else {
          throw new Error('Virhe käyttäjän poistamisessa');
        }
      })
      .catch((error) => {
        console.error('Virhe käyttäjän poistamisessa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Virhe',
          text: 'Käyttäjän poistaminen epäonnistui. Yritä uudelleen.',
        });
      });
  };

  return (
    <div className="container">
      <form key="deleteForm" className="delete-form">
        <div>
          <label htmlFor="usernameInput">Käyttäjän poisto:</label>
          <input
            id="usernameInput"
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Syötä käyttäjänimi"
          />
        </div>
        <div>
          <button type="button" onClick={confirmDelete} disabled={!username.trim()}>
            Poista käyttäjä
          </button>
        </div>
      </form>
    </div>
  );
};

export default Delete;