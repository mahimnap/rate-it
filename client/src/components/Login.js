import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { Container, Button, TextField, Typography, Paper, AppBar, Toolbar, Grid, Select, MenuItem, TextareaAutosize, IconButton } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate  = useNavigate(); 
    
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password,
        };
        
        axios.post('/auth/login', data)
            .then((response) => {
                console.log(response.data);
                navigate('/home'); 
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container component ="login" maxWidth ="xs">
            <AppBar position = 'static'>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuItem />
                    </IconButton>
                    <Typography 
                        variant='h3' 
                        component="div" 
                        style={{
                            position: 'absolute', 
                            left: '50%', 
                            transform:'translateX(-50%)',
                            marginTop:'20px',
                            fontWeight:' bold'
                    }}>
                        Login!
                    </Typography>
                </Toolbar>
            </AppBar>
            <Paper elevation={3} style={{padding: '20px'}}> 
                <form onSubmit={handleLogin}>
                    <TextField 
                        label="Username" 
                        value={username} 
                        onChange={handleUsernameChange} 
                        margin="normal" 
                        variant="outlined" 
                        fullWidth 
                    />
                    <TextField 
                        type="password"
                        label="Password" 
                        value={password}
                        onChange={handlePasswordChange}
                        variant='outlined'
                        fullWidth
                    />
                    <Button type="submit" variant="contained" style={{ marginTop:'10px', display:'flex', marginLeft:'auto', marginRight:'auto'}}>
                        Post Review
                    </Button>
                </form>
                <Typography variant='body2' style={{ display:'flex' , justifyContent:'center', marginTop:'20px'}}>
                    Don't have an account? 
                    <Link to="/signup" style={{marginLeft:'5px'}}>
                        Signup Now!
                    </Link>
                </Typography>
            </Paper> 
        </Container>
    );
}

export default Login;
