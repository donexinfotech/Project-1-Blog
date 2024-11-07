import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar';
import Home from './Home';
import Login from './Login/Login';
import Blogcreate from '../blog/blogCreate';
import Register from './Login/Register';
import UserProfile from '../user/userProfile';
import { AuthProvider } from '../auth/AuthContext';
import ForgotPassword from './Login/ForgotPassword';
import PasswordReset from './Login/PasswordReset';
import Quiz from '../quiz/Quiz'
import AnswerQuiz from '../quiz/answerQuiz';
import AddQuiz from '../quiz/addQuiz';
import About from './About';
import ConfirmRegister from './Login/ConfirmRegister';

function Pages() {
  return (
    <AuthProvider>
    <Router>
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
          </div>
        </div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-blog" element={<Blogcreate />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/password-reset/:email/:token" element={<PasswordReset/>} />
          <Route path="/quiz" element={<Quiz/>}/>
          <Route path="/quiz/:id" element={<AnswerQuiz/>}/>
          <Route path="/quiz/add" element={<AddQuiz/>}/>
          <Route path="/confirm/:email" element={<ConfirmRegister/>}/>
        </Routes>
    </Router>
    </AuthProvider>
  );
}

export default Pages;
