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
  );
}

export default Pages;
