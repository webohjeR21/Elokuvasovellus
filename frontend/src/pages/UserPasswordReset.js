	
	import Axios from 'axios'
	import React, {useState} from 'react'
	
	export default function UserPasswordReset({token, username}) {

	const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    Axios.post('http://localhost:3001/password-change', {
      username: username, // Replace with actual username
      oldPassword: oldPassword,
      newPassword: newPassword,
    }, {
      headers: {
        'x-accsess-token': token,
      }

    }).then((response) => {
      console.log(response.data);
    
    }).catch((error) => {
      console.error("Error changing password:", error.response.data.error);
    })
  }

		
	  return (
		<div className='ChangePassword'>
      <h2>Vaihda salasana</h2>
      <input type="password" placeholder="Vanha salasana" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <input type="password" placeholder="Uusi salasana" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={handleChangePassword}>Hyväksy</button>
    </div>
	  )
	}
	
		 