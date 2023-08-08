import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//children = restricted page passed from app.js
function PrivateRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true); //hook to set whether or not page is loading
    const [isAuthenticated, setIsAuthenticated] = useState(false); //hook to set whether or not logged in
    const navigate = useNavigate();

    /**
     * useEffect is a hook run when components either meet optional dependencies passed (array)
     * or everytime if none defined
     * differents from a function here because it is done automatically and not 
     * called by an eventhandler or lifecycle method 
     *      automatically done after render or dependency in those passed changes state
     * Used for things like fetching data, manually changing the DOM, etc. 
     */
    useEffect(() => { //no dependencies passed, so runs every render of PrivateRoute
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
        return <div>Loading...</div>; //try to update to animated spinner 
    }

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return children;
}

export default PrivateRoute;