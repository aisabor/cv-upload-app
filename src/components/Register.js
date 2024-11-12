import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setMessage(''); // Reset message

        try {
            const response = await axios.post('http://localhost:5001/api/register', {
                name,
                email,
                password,
            });

            // Check response from backend
            if (response.data.message === "User registered successfully") {
                setMessage("Registration successful!"); // Set success message
                // Optionally, redirect or clear the form
            }
        } catch (error) {
            console.error(error); // Log any error that occurred during the request
            if (error.response) {
                // Server responded with a status other than 200
                setMessage(error.response.data.error || "Registration failed."); // Display error from server
            } else {
                setMessage("An unexpected error occurred."); // Display generic error message
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Register</button>
            {message && <p>{message}</p>} {/* Display message to user */}
        </form>
    );
};

export default Register;
