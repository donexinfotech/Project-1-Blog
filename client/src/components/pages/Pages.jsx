import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar';
import Home from './Home'
import Login from './Login/Login'
import Blogcreate from '../blog/blogCreate';
import Register from './Login/Register';
import UserProfile from '../user/userProfile';

function Pages() {
  return (
    <>
    <div className="fixed top-0 -z-10 h-full w-full">
    <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
    </div>
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create-blog" element={<Blogcreate/>} />
        <Route path="/user/:id" element={<UserProfile/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default Pages;
