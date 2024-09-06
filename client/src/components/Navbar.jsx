import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-red-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Name</h1>
        <div className="flex space-x-6">
          <Link to="/" className="text-white hover:font-bold">Home</Link>
          <Link to="/login" className="text-white hover:font-bold">Login</Link>
          <Link to="/create-blog" className="text-white hover:font-bold">Create</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
