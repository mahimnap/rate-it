/* JUST FOR DOCUMENTATION. SETUP TERMINAL */ 

CREATE TABLE likes ( /*each row represents an individual like*/ 
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, /*user that liked the review*/
    review_id INT NOT NULL, /*review that was liked*/ 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*time the user liked the review for sorting purposes*/ 
    FOREIGN KEY (user_id) REFERENCES users(id), /*foreign key to ensure the provided user id by the server exists (referential integrity)*/ 
    FOREIGN KEY (review_id) REFERENCES reviews(id), /*foreign key to ensure the provided review id by the server exists*/ 
    CONSTRAINT unique_user_review UNIQUE (user_id, review_id) /*unique constraint to ensure a user can only like a review once*/
);