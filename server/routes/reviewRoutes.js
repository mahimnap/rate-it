const express = require('express'); 
const router = express.Router(); 
const mysql = require('mysql2');
const isLoggedIn = require('../helpers/isLoggedIn'); 
const pool = require('../config/dbConfig'); 
const cors = require('cors');

router.use(cors()); 

let clients = [];

const sendEvents = (data) => {
    clients.forEach(client => 
        client.write(`data: ${JSON.stringify(data)}\n\n`)
    );
};

router.get('/events', isLoggedIn, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Add this line
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // And this line
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

router.post('/post-review', isLoggedIn, (req, res) => {
    const {title, media, review, rating} = req.body; 
    const user_id = req.session.user_id; 
    const sql = 'INSERT INTO reviews (user_id, title, media, review, rating) VALUES (?, ?, ?, ?, ?)'; 
    const inserts = [user_id, title, media, review, rating];
    const query = mysql.format(sql, inserts); 
    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting review into database.', err); 
            return res.status(500).send('Error posting the review'); 
        } else {
            // Fetch the details of the newly inserted review
            const fetchReviewSql = `
                SELECT users.username, reviews.id, reviews.title, reviews.media, reviews.rating, reviews.review, reviews.like_count
                FROM reviews
                JOIN users ON reviews.user_id = users.id
                WHERE reviews.id = ?
            `;
            pool.query(fetchReviewSql, [result.insertId], (err, reviewDetails) => {
                if (err) {
                    console.error('Error fetching the newly inserted review:', err);
                    return res.status(500).send('Error fetching the new review');
                } else {
                    const newReview = {
                        ...reviewDetails[0],
                        liked: false //new review, so false by default
                    };
                    sendEvents({type: 'NEW_REVIEW', review: newReview});
                    return res.status(200).send('Review successfully posted.');
                }
            });
        }
    }); 
});

router.get ('/retrieve-user-reviews', isLoggedIn, (req, res) => {
    const user_id = req.session.user_id; 
    const sql = 'SELECT * FROM reviews WHERE user_id = ?' 
    const inserts = [user_id]; 
    const query = mysql.format(sql, inserts); 
    pool.query(query, (err, result) => {
        if (err) {
            console.error("Failed to retrieve user-specific reviews:", err); 
            return res.status(500).send('Failed to retrieve user-specific reviews'); 
        }
        else {
            console.log (result); 
            return res.json(result); 
        }
    });
});

router.delete('/delete-review', isLoggedIn, (req, res) =>{
    const review_id = req.query.review_id; 
    const user_id = req.session.user_id; 
    const deleteLikesSql = 'DELETE FROM likes WHERE review_id = ?'; 
    const deleteReviewSql = 'DELETE FROM reviews WHERE user_id = ? AND id = ?'; 

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err); 
            res.status(500).send('Error getting database connection'); 
            return; 
        }
        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err); 
                res.status(500).send('Error beginning transaction.'); 
                return; 
            }
            connection.query(deleteLikesSql, [review_id], (err, results) => {
                if (err) {
                    console.error('Error deleting likes:', err); 
                    res.status(500).send('Error deleting likes'); 
                    return connection.rollback(() => {}); 
                }
                connection.query(deleteReviewSql, [user_id, review_id], (err,results) => {
                    if (err) {
                        console.error('Error deleting review:', err); 
                        res.status(500).send('Error deleting review.'); 
                        return connection.rollback(() => {}); 
                    }
                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction'); 
                            res.status(500).send('Error committing transaction.'); 
                            return connection.rollback(() => {}); 
                        }
                        res.status(200).send('Review deleted successfully'); 
                    });
                });
            });
        });
        connection.release(); 
    });
}); 


router.get('/retrieve-reviews', isLoggedIn, (req, res) => {
    const sql = `
        SELECT users.username, reviews.id, reviews.title, reviews.media, reviews.rating, reviews.review, reviews.like_count
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        ORDER BY reviews.created_at DESC
    `;

    const sqlLikes = `
        SELECT review_id
        FROM likes
        WHERE user_id = ?
    `;

    pool.query(sql, (err, reviewResults) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).send('Error fetching reviews');
        } else {
            pool.query(sqlLikes, [req.session.user_id], (err, likeResults) => {
                if (err) {
                    console.error('Error fetching likes:', err);
                    return res.status(500).send('Error fetching likes');
                } else {
                    //convert the array of liked review IDs into a set for faster lookup
                    const likedReviewIds = new Set(likeResults.map(result => result.review_id));
                    const reviews = reviewResults.map(review => ({
                        ...review, //adds each review
                        liked: likedReviewIds.has(review.id), //sets boolean liked value
                    }));
                    console.log(reviews); 
                    return res.json(reviews);
                }
            });
        }
    });
});

module.exports = router;