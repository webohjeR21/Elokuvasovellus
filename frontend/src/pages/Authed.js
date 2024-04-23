import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Authed() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    Axios.get('http://localhost:3001/userAuth', {
      headers: {
        'x-access-token': token,
      },
    })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error('Error retrieving user information:', error);
      });
  }, []);

  const handlePasswordReset = () => {
    navigate('/Pw-reset');
  };

  return (
    <div className='homeContainer'>
      <h1>Kirjattu sisään {username} !</h1> 
      <div className='test1'>
        <button onClick={handlePasswordReset}>Salasanan vaihto</button>
      </div>
    </div>
  );
}

