import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Home from './Home'
import Login from './Login/Login'
import Blogcreate from '../blog/Blogcreate';

function Pages() {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/create-blog" element={<Blogcreate/>} />
      </Routes>
    </Router>
  );
}

export default Pages;
