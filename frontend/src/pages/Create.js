import React from 'react'

export default function Create() {
  return (
    <div>
      <div>
        <form action=''>
          <div>
            <label htmlFor='email'>Email</label>
            <input type='email' placeholder='Enter Email' />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' placeholder='Enter Password' />
          </div>
          <button className='button'>Log in </button>
          <button className='buttonCreate'> Luo käyttäjä </button>

        </form>
      </div>



    </div>
  )
}
