import React from 'react'
import './Navbar.css'
import logo from '../../Assets/notepad.png'
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='Navbar'>
      <div className="nav-logo"> 
          <img src={logo} alt='logo'></img>
        </div>
        <div className="nav-links">
          <button className="nav-btn">
             <Link to='/login-page'>Login</Link>
          </button>
          <button className="nav-btn">
            <Link to ='/signup-page'>SignnUp</Link>
          </button>
        </div>
    </div>
  )
}
