import './App.css'
import React from 'react'
import Create from './pages/Create'
import Navbar from './componets/Navbar'
import Footer from './componets/Footer'
import Header from './componets/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ShowTime from './pages/ShowTime'
import Search from './pages/Search'
import Login from './pages/Login'
import Delete from './pages/Delete'
import Authed from './pages/Authed'


function App() {
  return (
    <>
    <Header></Header>
    <Navbar></Navbar>
    <div className='container'> 
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path= "/Create" element={<Create />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/Showtime' element={<ShowTime />} />
        <Route path='/Search' element={<Search />} />
        <Route path='/LoginPage' element={<Login />} />
        <Route path='/Authed' element={<Authed />} />
        <Route path='/Delete' element={<Delete />} />
         </Routes>
    </div>
    <Footer></Footer>
   </>
  )

}

export default App
