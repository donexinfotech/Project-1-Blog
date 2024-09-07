import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar';
import Home from './Home'
import Login from './Login/Login'
import Blogcreate from '../blog/Blogcreate';
import BlogDetails from '../blog/Blogdetails';
import Register from './Login/Register';

function Pages() {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create-blog" element={<Blogcreate/>} />
        <Route path="/blogs/:id" element={<BlogDetails/>} />
      </Routes>
    </Router>
  );
}

export default Pages;
