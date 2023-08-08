CREATE TABLE reviews(
    id INT AUTO_INCREMENT PRIMARY KEY, /*unique review identifier*/
    user_id INT NOT NULL, /*user that made the review*/ 
    title VARCHAR(40) NOT NULL, /*title of the media being reviewed*/ 
    media VARCHAR(40) NOT NULL, /*format of the media (music, video, movie, tv show)*/ 
    review VARCHAR(1000) NOT NULL, /*long-form section of the review*/ 
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10), /*1 - 10 score to overview the review*/ 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*time review was created*/ 
    like_count INT DEFAULT 0, /*likes review has received*/ 
    FOREIGN KEY (user_id) REFERENCES users(id) /*referential integrity of user id - i.e. confirm it exists*/ 
);