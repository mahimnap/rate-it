require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const acctRoutes = require('./routes/acctRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes'); 
const likeRoutes = require('./routes/likeRoutes');

const app = express();
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build'))); // serving the build folder

//the reason router works is because express passes middleware to it
//so anything set by app.use() is available to routes routed in server.js
app.use('/auth', authRoutes);
app.use('/acct', acctRoutes); 
app.use('/review', reviewRoutes); 
app.use('/like', likeRoutes); 

// Catch-all route to send all requests not matched by the above routes to your React app

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
