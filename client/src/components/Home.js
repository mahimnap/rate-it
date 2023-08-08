import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, TextField, Typography, Paper, Grid, Select, MenuItem, TextareaAutosize, IconButton } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

function Home() {
    const [title, setTitle] = useState(''); 
    const [media, setMedia] = useState(''); 
    const [rating, setRating] = useState(0); 
    const [review, setReview] = useState(''); 
    const [reviews, setReviews] = useState([]); 
    const [showForm, setShowForm] = useState(false); 
    const navigate = useNavigate(); 

    /**
     * SSE that listens for a new post on the server and 
     * notifies users immidiately when a post is submitted .
     * Unlike fetchDataReviews, this fetches just the newest
     * review and appends that to the list
     * which was not possible with fetchReviews 
     * - i.e. significantly more efficient and 
     *      gives the website a live social feed
     */
    useEffect (() => {
        const eventSource = new EventSource('/review/events'); 
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data); 
            if (data.type === 'NEW_REVIEW') {
                setReviews(prevReviews => [data.review, ...prevReviews]);
            }
        };
        return () => {
            eventSource.close(); 
        };

    }, []); 

    /**
     * While fetchReviews() is less efficient 
     * than the eventSource SSE implementation
     * due to it pulling the whole table of reviews,
     * it is needed on page load until 
     * caching is implemented because the SSE 
     * only listens for the latest update 
     * in the listings
     */

    useEffect (() => {
        fetchReviews(); 
    }, []); 

    /**
     * Unlike SSE above, this just refreshes 
     * review feed for those that trigger it
     * to allow them to interact with the website 
     * (e.g. like a post and see the like immidiately) 
     * Both this and a SSE were done because an SSE
     * is only necessary when there is new content 
     * availble. 
     */
    const fetchReviews = () => {
        axios.get('/review/retrieve-reviews')
            .then((response) => {
                setReviews(response.data); 
            })
            .catch((error) => {
                console.error(error); 
            });
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value); 
    };
    const handleMediaChange = (e) => {
        setMedia(e.target.value); 
    };
    const handleRatingChange = (e) => {
        setRating(e.target.value); 
    };
    const handleReviewChange = (e) => {
        setReview(e.target.value); 
    }

    const clearForm = () => {
        setTitle(''); 
        setMedia(''); 
        setRating(0); 
        setReview(''); 
    }

    /**
     * if successful, will result in a review
     * being posted and all users on the network's 
     * feed being updated thanks to the
     * SSE 
     */
    const handleReviewPost = (e) => {
        e.preventDefault(); 
        const data = {
            title: title,
            media: media, 
            review: review, 
            rating: rating
        }
        axios.post('/review/post-review', data)
            .then((response) => {
                console.log(response.data); 
                setShowForm(false); 
                clearForm(); 
            })
            .catch((error) => {
                console.error(error); 
            });
    }

    const handleLogout = () => {
        axios.get('/auth/logout')
        .then((response) =>{
            console.log(response); 
            navigate('/login'); 
        })
        .catch((error) => {
            console.error(error); 
        }); 
    };

    /**
     * add like to post on local render 
     * and store the like event in the database 
     */
    const handleLike = (review_id) => {
        const data = {
            review_id: review_id
        }
        setReviews(prevReviews => {
            const updatedReviews = [...prevReviews];
            const reviewIndex = updatedReviews.findIndex(review => review.id === review_id);

            if (reviewIndex !== -1) {
                updatedReviews[reviewIndex].like_count += 1;  // Corrected this line
                updatedReviews[reviewIndex].liked = true;
            }
            return updatedReviews;
        });

        axios.post('/like/like-review', data)
            .then((response) => {
                console.log(response.data); 
            })
            .catch((error) => {
                console.error(error); 
            });
    };

    /**
     * add like to post on local render 
     * and store the like event in the database 
     */
    const handleUnlike = (review_id) => {
        setReviews(prevReviews => {
            const updatedReviews = [...prevReviews];
            const reviewIndex = updatedReviews.findIndex(review => review.id === review_id);

            if (reviewIndex !== -1) {
                updatedReviews[reviewIndex].like_count -= 1;  // Corrected this line
                updatedReviews[reviewIndex].liked = false;
            }
            return updatedReviews;
        });

        axios.delete('/like/unlike-review', { params: { review_id: review_id} })
            .then((response) => {
                console.log(response.data); 
            }) 
            .catch((error) => {
                console.error(error); 
            });     
    }

    return (
        <Container maxWidth="md">
            <h1>Home Page</h1>
            <div>
                <Link to='/profile'>My Profile</Link><br />
                <button onClick={handleLogout}>Logout</button>  
                {!showForm && <button onClick={() => setShowForm(true)}>New Post</button>}
            </div>
            {showForm && ( 
                <>
                    <form onSubmit={handleReviewPost}> 
                        <div>
                            <label htmlFor="title">Title:</label>
                            <input 
                                type="text" 
                                id="title" 
                                required={true} 
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="media">Media:</label>
                            <select
                                id="media"
                                required={true}
                                value={media}
                                onChange={handleMediaChange}
                            >
                                <option value="">Select...</option>
                                <option value="Movie">Movie</option>
                                <option value="TV Show">TV Show</option>
                                <option value="Music">Music</option>
                                <option value="Book">Book</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="10" 
                                step="1" 
                                required={true} 
                                value={rating}
                                onChange={handleRatingChange}
                            />

                        </div>
                        <div>
                            <label htmlFor="review">Review:</label>
                            <textarea 
                                maxLength="1000" 
                                required={true}
                                onChange={handleReviewChange} 
                            />
                        </div>
                        <div>
                            <Button type="submit">Post Review</Button>
                        </div>
                    </form>
                    <div>
                        <button onClick={() => {
                            setShowForm(false);
                            clearForm(); 
                        }}>Cancel</button>
                    </div>
                </>
            )}
            <div> 
                <button onClick={fetchReviews}>Refresh Reviews</button>
                {reviews.map((review, index) => (
                    <div key={index}>
                        <h2>Title: {review.title}</h2>
                        <p>
                            <b>Username: </b>{review.username}<br />
                            <b>Media-Type: </b>{review.media}<br />
                            <b>Rating: </b>{review.rating}/10<br />
                            <b>Review: </b>{review.review}<br />
                            <b>Like Count: </b>{review.like_count}<br />
                            {review.liked ? <button onClick={() => handleUnlike(review.id)}>Unlike</button> : 
                            <button onClick={() => handleLike(review.id)}>Like</button>}
                        </p>
                    </div> 
                ))}
            </div> 
        </Container>
    );
}

export default Home;