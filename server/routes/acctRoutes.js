const express = require('express'); 
const router = express.Router(); 
const mysql = require('mysql2');
const isLoggedIn = require('../helpers/isLoggedIn'); 
const pool = require('../config/dbConfig'); 

router.delete('/delete-account', isLoggedIn, (req, res) => {

    const user_id = req.session.user_id;
    const sql = 'DELETE FROM users WHERE id = ?';
    const inserts = [user_id]; 
    const query = mysql.format(sql, inserts); 

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err); 
            return res.status(500).send('Error deleting user.'); 
        } else {
            console.log ('User deleted from DB. Now Attempting to destroy session.'); 
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session after deleting profile:', err); 
                    return res.status(500).send('Error destroying session after deleting profile.'); 
                } else {
                    console.log('Account deletion successful.'); 
                    return res.status(200).send('Account deletion successful.'); 
                }
            });
        }
    }); 
});



module.exports = router; 
