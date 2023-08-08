import React, { useState } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom'; 

function Signup() {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigate = useNavigate(); 

    const handleUsernameChange = (e) => {
        setUsername (e.target.value); 
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); 
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); 
    }

    const handleSignup = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setErrorMessage('Password and confirm password do not match!'); 
            return; 
        }

        const data = {
            username: username, 
            password: password, 
            confirmPassword: confirmPassword,
        }; 

        axios.post('/auth/signup', data)
            .then((response) => {
                console.log(response.data); 
                navigate('/home'); 
            })
            .catch((error) => {
                console.error(error); 
            });
    }

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
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
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                </div>
                {errorMessage && <p>{errorMessage}</p>}
                <div>
                    <button type="submit">Signup</button>
                </div>
            </form>
            <p>
                Already have an account? <Link to="/login">Login Instead</Link>
            </p>
        </div>
    );
}

export default Signup;