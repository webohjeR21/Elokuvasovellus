import React, { useState } from 'react'
import Axios from 'axios'
import './Create.css'
import { useNavigate } from 'react-router-dom'


export default function Create() {

  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [emailReg, setEmailReg] = useState('')

  const navigate = useNavigate()
 
  const register = () => {
   
    Axios.post('http://localhost:3001/register', {
      username: usernameReg,
      password: passwordReg,
      email: emailReg,
    }).then((response) => {
      console.log(response)

    
    })
    .catch((error) => {
      console.error("Virhe rekistiröinnossä:", error)
      
    })
  }

  const loginPage = () => {
    navigate.push('/login')
  }

  return (
    <div className='App'>
      <div className='registration'>
       <h1>Käyttäjän luonti</h1>
       <label>Käyttäjänimi</label>
       <input type="text" onChange={(e) => setUsernameReg(e.target.value)} />

       <label>Sähköposti</label>
       <input type="text" onChange={(e) => setEmailReg(e.target.value)} />

       <label>Salasana</label>
       <input type="password" onChange={(e) => setPasswordReg(e.target.value)} />
       
       <button onClick={register}>Luo käyttäjä</button>

       <div className='logiiin'>
          <button onClick={() => {
            navigate("/LoginPage")
          }}>Kirjaudu sisään</button>
      </div>
      </div>
    </div>
  )
}
