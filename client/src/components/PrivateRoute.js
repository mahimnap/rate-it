import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PrivateRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/auth/is-logged-in')
            .then(() => {
                setIsAuthenticated(true);
                setIsLoading(false);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return children;
}

export default PrivateRoute;