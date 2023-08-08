import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

function Profile() {
    const navigate = useNavigate();
    const [isLikes, setIsLikes] = useState(false); 
    const [feed, setFeed] = useState ([]); 


    useEffect(() => { //I believe this statement just allows it to load automatically on arrival
        if (isLikes){
            handleLikes(); 
        }
        else {
            handleReviews(); 
        }
    }, []);

    const handleDeleteAccount = () => {
        axios.delete('/acct/delete-account')
            .then((response) => {
                console.log(response.data); 
                navigate('/login'); 
            })
            .catch((error) => {
                console.error(error); 
            });
    };

    const handleDeleteReview = (review_id) => {
        axios.delete('/review/delete-review', { params: { review_id: review_id} } )
            .then((response) => {
                console.log(response.data); 
                handleReviews();
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

    const handleLikes = () => { 
        axios.get('/like/retrieve-user-likes')
            .then((response) => {
                setIsLikes(true); 
                setFeed(response.data); 
            })
            .catch((error) => {
                console.log(error); 
            });
    }

    const handleReviews = () => {
        axios.get('/review/retrieve-user-reviews')
            .then ((response) => {
                setIsLikes(false); 
                setFeed(response.data); 
            })
            .catch((error) => {
                console.log(error); 
            });
    }
    
    return (
        <div>
            <h1>Profile Page</h1>
            <div> 
                <Link to='/home'>Home</Link><br />
                <button onClick={handleDeleteAccount}>Delete Account</button><br />
                <button onClick={handleLogout}>Logout</button>  
            </div>
                {isLikes ? <button onClick={handleReviews}>See Reviews</button>:<button onClick={handleLikes}>See Likes</button>}
                {feed.map((review, index) => (
                    <div key={index}>
                        <h2>{review.title}</h2>
                        <b>Username: </b>{review.username}<br />
                        <b>Media-Type: </b>{review.media}<br />
                        <b>Rating: </b>{review.rating}/10<br />
                        <b>Review: </b>{review.review}<br />
                        <b>Like Count: </b>{review.like_count}<br />
                        {(!isLikes) && <button onClick={() => handleDeleteReview(review.id)}>Delete</button>}
                    </div>
                ))}

            <div>

            </div>
        </div>
    );
}

export default Profile;