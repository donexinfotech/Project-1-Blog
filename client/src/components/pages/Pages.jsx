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
      <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
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
