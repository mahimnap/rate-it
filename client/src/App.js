import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import { blue, red, white } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

function App() {

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
    () =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );
    return (
        <ThemeProvider theme = {theme}>
            <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    </Routes>
                </Router>
        </ThemeProvider>
    );
}

export default App;
