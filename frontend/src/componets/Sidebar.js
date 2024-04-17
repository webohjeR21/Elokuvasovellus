import React from 'react'
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as FiIcons from "react-icons/fi"

export const Sidebar = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cNameT: 'nav-text'
    },
    {
        title: 'Luo käyttäjä',
        path: '/create',
        icon: <FiIcons.FiUserPlus />,
        cNameT: 'nav-text'
    },
    {
        title: 'Näytösajat',
        path: '/showtime',
        icon: <IoIcons.IoIosPaper />,
        cNameT: 'nav-text'
    },
    {
        title: 'Selaa elokuvia',
        path: '/search',
        icon: <FaIcons.FaSearch />,
        cNameT: 'nav-text'
    },

]