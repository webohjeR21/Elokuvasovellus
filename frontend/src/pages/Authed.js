import React, { useState, useEffect } from 'react';
import './Create.css';
import { useNavigate } from 'react-router-dom';

export default function Authed() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setLoggedInUser(username);
    }
  }, []);

  return (
    <div className='homeContainer'>
      <h1>Kirjattu sisään</h1>
      {loggedInUser && (
        <div>
          <p>Kirjautunut käyttäjä: {loggedInUser}</p>
          <button onClick={() => navigate('/Pw-reset')}>Vaihda salasana</button>
        </div>
      )}
    </div>
  );
}
