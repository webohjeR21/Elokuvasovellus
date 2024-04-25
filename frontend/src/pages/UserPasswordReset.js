import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function UserPasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [realUsername, setUsername] = useState(' ');
  const [BearerToken, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    if (token) {
      setToken(token);
      setUsername(name);
      console.log("username tuli:", name);
      console.log("Tokeni tuli:", token);
    }
  }, []);

  const handleChangePassword = () => {
    Axios.post(
      'http://localhost:3001/password-change',
      {
        newPassword: newPassword,
        realUsername: realUsername,
      },
      {
        headers: {
          'Authorization':BearerToken
        },
      }
    )
      .then((response) => {
        console.log("Meni läpi", response.data);
      })
      .catch((error) => {
        console.error('Error changing password:', error.response.data.error);
      });
  };

  return (
    <div className='passwordReset'>
      <h2>Vaihda salasana</h2>
      <input
        type='password'
        placeholder='Uusi salasana'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Hyväksy</button>
    </div>
  );
}
