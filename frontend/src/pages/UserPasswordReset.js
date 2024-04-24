import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function UserPasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, []);

  const handleChangePassword = () => {
    Axios.post(
      'http://localhost:3001/password-change',
      {
        newPassword: newPassword,
      },
      {
        headers: {
          'x-access-token': token,
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
