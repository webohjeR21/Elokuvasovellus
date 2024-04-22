	import React, { useState } from 'react';
	import Parse from 'parse'
    import { Button, Divider, Input } from 'antd';
	
	
		export default function UserPasswordReset() {
			const [email, setEmail] = useState('');
	
			// Functions used by the screen components
			const doRequestPasswordReset = async function () {
			  // Note that this value come from state variables linked to your text input
			  const emailValue = email;
			  try {
				await Parse.User.requestPasswordReset(emailValue);
				alert(`Success! Please check ${email} to proceed with password reset.`);
				return true;
			  } catch (error) {
				// Error can be caused by lack of Internet connection
				alert(`Error! ${error}`);
				return false;
			  }
		};
		  
		return (
			  <div>
				<div className="header">
				  <img
					className="header_logo"
					alt="Back4App Logo"
					src={
					  'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png'
					}
			  />
				  <p className="header_text_bold">{'React on Back4App'}</p>
				  <p className="header_text">{'User Password Reset'}</p>
				</div>
				<div className="container">
				  <h2 className="heading">{'Request password reset email'}</h2>
				  <Divider />
				  <div className="form_wrapper">
					<Input
					  value={email}
					  onChange={(event) => setEmail(event.target.value)}
					  placeholder="Your account email"
					  size="large"
					  className="form_input"
					/>
				  </div>
				  <div className="form_buttons">
					<Button
					  onClick={() => doRequestPasswordReset()}
					  type="primary"
					  className="form_button"
					  color={'#208AEC'}
					  size="large"
					>
					  Request password reset
					</Button>
				  </div>
				</div>
			  </div>
			);
		  };
		  
		  
		 