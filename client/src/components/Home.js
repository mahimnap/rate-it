import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import { ThumbUp, ThumbDown, ExpandMore } from '@mui/icons-material'; //look for filled and empty hearts in icons-material
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; 
import { Container, Button, Card, CardActions, CardHeader, IconButton, CardContent, TextField, Typography,
        Paper, ListItem, Select, MenuItem, TextareaAutosize, Collapse, Menu, AppBar, Toolbar, 
        Grid, Box } from '@mui/material';

function Home() {
    const [title, setTitle] = useState(''); 
    const [media, setMedia] = useState(''); 
    const [rating, setRating] = useState(0); 
    const [review, setReview] = useState(''); 
    const [reviews, setReviews] = useState([]); 
    const [showForm, setShowForm] = useState(false); 
    const navigate = useNavigate(); 
    const [username, setUsername] = useState(''); 
    const theme = useTheme(); 

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
        handleUsername();
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

    const handleUsername = () => {
        axios.get('/acct/username')
            .then ((response) => {
                console.log(response.data); 
                setUsername(response.data); 
            })
            .catch((error) => {
                console.log(error); 
            });
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
                fetchReviews();
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
                fetchReviews();
                console.log(response.data); 
            }) 
            .catch((error) => {
                console.error(error); 
            });     
    }

    const [anchorEl, setAnchorEl] = useState(null); 
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget); 
    };
    const handleMenuClose = () => {
        setAnchorEl(null); 
    };

    const [expandedCard, setExpandedCard] = useState(null); 

    const handleExpandClick = (index) => {
        if (expandedCard === index) {
            setExpandedCard(null); 
        }
        else {
            setExpandedCard(index); 
        }
    };

    return (
        <div>
            <AppBar position = "static">
                <Toolbar>
                    <Typography variant='h6' style={{flexGrow: 1}}>
                        Rate It
                    </Typography>
                    <Typography
                        variant="body1"
                        style={{cursor: 'pointer'}}
                        onClick={handleMenuOpen} 
                    >
                        {username}
                    </Typography>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose} 
                    >
                        <ListItem button component={Link} to="/profile">
                            My Profile
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            Logout
                        </ListItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, marginTop: '20px'}}>
                <Paper
                    elevation={3} 
                    style={{
                        padding :'10px', 
                        marginBottom: '20px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                    }} 
                    onClick={ () => setShowForm((prev) => !prev)}
                >
                    <div style={{textAlign: 'center'}}>
                        <Typography fontWeight="bold" variant="body1">New Post</Typography>
                    </div>
                    <div>
                        <ExpandMoreIcon />  
                    </div>
                </Paper>
                    <Collapse in={showForm}>
                        <form onSubmit={handleReviewPost}>
                            <TextField
                                fullWidth 
                                label="Title"
                                id = "title" 
                                value={title}
                                onChange={handleTitleChange}
                            />
                            <Select
                                fullWidth 
                                value={media}
                                id="media"
                                onChange={handleMediaChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Media Type</em>
                                </MenuItem>
                                <MenuItem value="Movie">Movie</MenuItem>
                                <MenuItem value="TV Show">TV Show</MenuItem>
                                <MenuItem value="Music">Music</MenuItem>
                                <MenuItem value="Book">Book</MenuItem>
                            </Select>
                            <TextField
                                fullWidth
                                type="number"
                                label="Rating"
                                id="rating" 
                                value={rating}
                                onChange={handleRatingChange}
                            />
                            <TextareaAutosize
                                fullWidth
                                rowsMin={3}
                                id="review" 
                                placeholder="Write your review here..."
                                value={review} 
                                onChange={handleReviewChange}
                            />
                            <Button type="submit" fullWidth variant="contained" style={{marginTop: '10px', padding: '10px'}}>
                                Post Review
                            </Button>
                        </form>
                    </Collapse>

                    {reviews.map((review, index) => (
                        <Card key={index} elevation={3} style={{margin: '10px 0' }}>
                            <Box display="flex" flexDirection="column">

                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        src="https://at-cdn-s01.audiotool.com/2012/12/19/users/tyreeg64/avatar256x256-ada09af3501e4763a8d3207a744453b3.jpg"
                                        alt="Default Profile"
                                    />
                                    <Typography variant="body2" style={{ marginTop: '5px', fontSize: '0.8rem' }}>
                                        {'@' + review.username}
                                    </Typography>
                                </Box>

                                {/*added for spacing between avatar+user and title+rating+media boxes*/}
                                <Box style={{ height: '10px' }}></Box>

                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h6" align="center" style={{ fontWeight: 'bold' }}>
                                        {review.title}
                                    </Typography>
                                    <Typography variant="body2" align="center" style={{fontWeight: 'bold' }}>
                                        Content: {review.media}
                                    </Typography>
                                    <Typography variant="body2" align="center" style={{ fontWeight: 'bold' }}>
                                        User Rating: {review.rating}/10
                                    </Typography>
                                </Box>
                            </Box>
                            <Collapse in={expandedCard === index} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <TextareaAutosize
                                        fullWidth 
                                        rowMin={3}
                                        placeholder="Write your review here..."
                                        value={review.review}
                                        style={{width:'100%'}}
                                        color='' 
                                        readOnly
                                    />
                                </CardContent>
                            </Collapse>
                            <CardContent>
                                <IconButton
                                    onClick={() => handleExpandClick(index)}
                                    aria-expanded={expandedCard === index} 
                                    aria-label="show more" 
                                >
                                        <ExpandMoreIcon />
                                </IconButton>
                            </CardContent>
                            <CardActions>
                                <Box display="flex" alignItems="center">
                                    {review.liked ? 
                                        <IconButton onClick={() => handleUnlike(review.id)}>
                                            <FavoriteIcon color="error" />
                                        </IconButton> : 
                                        <IconButton onClick={() => handleLike (review.id)}>
                                            <FavoriteBorderIcon color="error" />
                                        </IconButton>
                                    }
                                    <Typography>{review.like_count}</Typography>
                                </Box>
                            </CardActions>
                        </Card>
                    ))}
                </Container>
            </div>
        );
    }            
export default Home;