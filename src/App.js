import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to make HTTP requests
import CVGallery from './pages/CVGallery';
import UploadCV from './components/UploadCV';
import Footer from './components/Footer';
import './styles/styles.css';
import logo from './pages/images/logo.jpeg';

function App() {
    const [cvs, setCvs] = useState([]);
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
    const [isLoginForm, setIsLoginForm] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Fetch CVs when the component mounts
    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/cvs');
                if (Array.isArray(response.data)) {
                    setCvs(response.data); // Ensure you're updating the state with an array
                } else {
                    console.error('Expected array but received:', response.data);
                }
            } catch (error) {
                console.error('Error fetching CVs:', error);
            }
        };

        fetchCvs(); // Initial fetch when component mounts
    }, []);  // Empty dependency array to only run on mount

    // Handle adding a new CV
    const handleAddCV = (newCV) => {
        setCvs((prevCvs) => [...prevCvs, newCV]);
    };

    // Handle user registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/register', user);
            if (response.status === 201) {
                alert('User registered successfully');
                handleLogin({ email: user.email, password: user.password });  // Automatically login after registration
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration error: ' + error.message);
        }
    };

    // Handle user input changes for registration
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle user login
    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5001/api/login', credentials);
            const data = response.data;
            if (response.status === 200) {
                setCurrentUser({ id: data.userId, name: data.name, email: data.email });
                setLoginError('');
            } else {
                setLoginError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError('An error occurred while logging in');
        }
    };

    // Handle changes to the login form inputs
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginCredentials({ ...loginCredentials, [name]: value });
    };

    return (
        <div className="app-container">
            <img src={logo} alt="UnfortunateCV Logo" style={{ width: '150px', marginBottom: '20px' }} />
            <h1>UnfortunateCV</h1>

            {!currentUser ? (
                isLoginForm ? (
                    <>
                        <h2>Login</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(loginCredentials); }}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginCredentials.email}
                                onChange={handleLoginChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginCredentials.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <button type="submit">Login</button>
                        </form>
                        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        <button onClick={() => setIsLoginForm(false)}>Switch to Register</button>
                    </>
                ) : (
                    <>
                        <h2>Register</h2>
                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={user.name}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={user.email}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={user.password}
                                onChange={handleUserChange}
                                required
                            />
                            <button type="submit">Register</button>
                        </form>
                        <button onClick={() => setIsLoginForm(true)}>Switch to Login</button>
                    </>
                )
            ) : (
                <div>
                    <h3>Welcome, {currentUser.name}</h3>
                    <UploadCV onAddCV={handleAddCV} userId={currentUser.id} />
                </div>
            )}

            <CVGallery cvs={cvs} currentUser={currentUser} />
            <Footer />
        </div>
    );
}

export default App;
