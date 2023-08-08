const express = require('express'); 
const router = express.Router(); 
const mysql = require('mysql2');
const isLoggedIn = require('../helpers/isLoggedIn'); 
const pool = require('../config/dbConfig'); 

router.get('/retrieve-user-likes', isLoggedIn, (req,res) => {
    const user_id = req.session.user_id; 
    const sql = 'SELECT reviews.* FROM likes JOIN reviews ON likes.review_id = reviews.id WHERE likes.user_id = ?';
    const inserts = [user_id]; 
    const query = mysql.format(sql, inserts); 
    pool.query(query, (err, result) => {
        if (err) {
            console.log('Failed to retrieve user liked posts: ', err); 
        }
        else {
            console.log(result); 
            return res.json(result); 
        }
    });
});

router.post('/like-review', isLoggedIn, (req, res) => {
    const user_id = req.session.user_id; 
    const review_id = req.body.review_id; 

    const insertLikeSql = `
        INSERT INTO likes (user_id, review_id)
        VALUES (?, ?)
    `;

    const updateReviewSql = `
        UPDATE reviews
        SET like_count = like_count + 1
        WHERE id = ?
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Error getting database connection');
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                res.status(500).send('Error beginning transaction');
                return;
            }

            connection.query(insertLikeSql, [user_id, review_id], (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).send('You have already liked this review');
                    } else {
                        console.error('Error inserting like:', err);
                        res.status(500).send('Error inserting like');
                    }
                    return connection.rollback(() => {});
                }

                connection.query(updateReviewSql, [review_id], (err, results) => {
                    if (err) {
                        console.error('Error updating review:', err);
                        res.status(500).send('Error updating review');
                        return connection.rollback(() => {});
                    }

                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            res.status(500).send('Error committing transaction');
                            return connection.rollback(() => {});
                        }

                        res.status(200).send('Like added successfully');
                    });
                });
            });
        });

        connection.release();
    });
});

router.delete('/unlike-review', isLoggedIn, (req, res) => {
    const user_id = req.session.user_id; 
    const review_id = req.query.review_id; //delete, so encoded in the url

    const deleteLikeSql = `
        DELETE FROM likes
        WHERE user_id = ? AND review_id = ?
    `;

    const updateReviewSql = `
        UPDATE reviews
        SET like_count = like_count - 1
        WHERE id = ?
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Error getting database connection');
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                res.status(500).send('Error beginning transaction');
                return;
            }

            connection.query(deleteLikeSql, [user_id, review_id], (err, results) => {
                if (err) {
                    console.error('Error deleting like:', err);
                    res.status(500).send('Error deleting like');
                    return connection.rollback(() => {});
                }

                if (results.affectedRows === 0) {
                    res.status(400).send('You have not liked this review');
                    return connection.rollback(() => {});
                }

                connection.query(updateReviewSql, [review_id], (err, results) => {
                    if (err) {
                        console.error('Error updating review:', err);
                        res.status(500).send('Error updating review');
                        return connection.rollback(() => {});
                    }

                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            res.status(500).send('Error committing transaction');
                            return connection.rollback(() => {});
                        }

                        res.status(200).send('Like removed successfully');
                    });
                });
            });
        });

        connection.release();
    });
});

module.exports = router;