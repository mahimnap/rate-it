import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
