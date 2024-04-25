import React, { useState, useEffect } from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';
import Api from '../pages/ApiHaku';

export default function Footer() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();


  const checkLoginStatus = async () => {
    try {
      const logged = await Api.TarkistaToken();
      setLoggedIn(logged);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus(); 
  }, []);

  checkLoginStatus();

  const KirjaaUlos = async () => {
    try {
      localStorage.clear();
      setLoggedIn(false); 
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <footer>
      {loggedIn && (
      <div className='asiakas'>
        <button className='logout' onClick={KirjaaUlos}>Kirjaudu ulos</button>
        <p>Kirjautunut: {localStorage.getItem('username')}</p>
      </div>
    )}
    </footer>
  );
}
