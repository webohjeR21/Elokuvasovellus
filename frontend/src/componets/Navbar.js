import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import * as FaIcons from "react-icons/fa"
import * as IoIcons from "react-icons/io"
import {IconContext, icontContext} from 'react-icons'
 

export default function Navbar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebarMenu = () => setSidebar(!sidebar)
    return (
        <>
        <IconContext.Provider value={{color: '#fff'}}>
            <div className='navbar'>
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebarMenu} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} >
                <ul className='nav-menu-items' onClick={showSidebarMenu}>
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <IoIcons.IoIosClose />
                        </Link>
                    </li>
                    {Sidebar.map((item, index) => {
                        return (
                            <li key={index} className={item.cNameT}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}


                </ul>
            </nav>
            </IconContext.Provider>

        </>
    )
}
