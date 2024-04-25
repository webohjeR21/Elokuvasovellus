import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function UserPasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [BearerToken, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      console.log("Tokeni tuli:", token);
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
          'Authorization':BearerToken
        },
      }
    )
      .then((response) => {
        if (response.status === 200){
          alert("vaihto onnistui");
        } else {
          alert("vaihto epäonnistui");
        }
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
      <button onClick={() => {handleChangePassword(); setNewPassword('');}}>Hyväksy</button>

    </div>
  );
}
