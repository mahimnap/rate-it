import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

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
        // Make a POST request to backend to handle login
        const data = {
            username: username,
            password: password,
        };
        
        axios.post('/auth/login', data)
            .then((response) => {
                console.log(response.data); // This will show the response data from the server
                navigate('/home'); 
            })
            .catch((error) => {
                console.error(error);
            });
    };

  return (
    <div>
        <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username} // value is the hooks variable
                        onChange={handleUsernameChange} //on change, use the function that updates hook variable
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Signup Instead</Link>
            </p>
        </div>
    );
}

export default Login;
