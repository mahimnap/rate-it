const express = require('express'); 
const router = express.Router(); 
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const isLoggedIn = require('../helpers/isLoggedIn'); 
const pool = require('../config/dbConfig'); 

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    const inserts = [username]; 
    const query = mysql.format(sql, inserts); 
  
    pool.query(query, (err, result) => {
        if (err) {
            console.error ('Error retrieving user:', err); 
            return res.status(500).send('Error retrieving user.'); 
        } else if (result.length == 0) {
            return res.status(401).send('User not found.'); 
        } else {
            const user = result[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error retrieving user data:', err); 
                    return res.status(500).send('Error retrieving user data.'); 
                } else if (!isMatch) {
                    res.status(401).send('User not found.'); 
                } else {
                    req.session.user_id = user.id;
                    req.session.username = user.username;
                    return res.status(200).send('Login Successful!'); 
                }
            });
        }
    });
});

router.post('/signup', (req, res) => {
    const { username, password, confirmPassword } = req.body; 

    if (!username || !password || username.trim() === '' || password.trim() === '') {
        const errorResponse = {
            error: true, 
            message: "Username and password cannot be blank", 
        }; 
        return res.status(400).send(errorResponse);
    }
    

    if (password !== confirmPassword) {
        const errorResponse = {
            error: true, 
            message: "Password and Confirm Password do not match", 
        }; 
        return res.status(400).send(errorResponse); //always return because the server will continue executing remaining route without it
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error creating user.'); 
        } else {
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)'; 
            const inserts = [username, hash]; 
            const query = mysql.format(sql, inserts); 

            pool.query(query, (err, result) => {
                if (err) {
                    console.error('Error creating user:', err); 
                    return res.status(500).send('Error creating user.'); 
                } else {
                    console.log('User created:', username); 
                    req.session.user_id = result.insertId;
                    req.session.username = username;
                    return res.status(200).send('User created successfully. Logging in now.'); 
                }
            });
        }
    });
});

router.get('/is-logged-in', isLoggedIn, (req,res) =>{
    return res.status(200).send('user is logged in'); 
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err); 
            return res.status(500).send('Error logging out.'); 
        } else {
            console.log('User logged out.'); 
            return res.status(200).send('User logged out.'); 
        }
    });
});

module.exports = router; 