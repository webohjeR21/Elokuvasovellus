import React, { useState } from 'react'
import Axios from 'axios'
import './Create.css'
import { useNavigate } from 'react-router-dom'


export default function Login() {

  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')

  const navigate = useNavigate()
 
  const log = () => {
   
    Axios.post('http://localhost:3001/login', {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response)
      if (response.status == 200){
        navigate('/Authed');
      }
    
    })
    .catch((error) => {
      console.error("Virhe kirjautumisessa:", error)
      
    })
  }


  return (
    <div className='App'>
      <div className='registration'>
       <h1>Kirjaudu sisään</h1>
       <label>Käyttäjänimi</label>
       <input type="text" onChange={(e) => setUsernameReg(e.target.value)} />

       <label>Salasana</label>
       <input type="password" onChange={(e) => setPasswordReg(e.target.value)} />
       
       <button onClick={log}>Kirjaudu</button>

      </div>
    </div>
  )
}
