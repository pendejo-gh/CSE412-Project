// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useState } from 'react';

const Signup = ({ onAuthSuccess, switchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState(''); // Placeholder for now
    const [role, setRole] = useState('user'); // Default to Customer
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!firstName || !lastName || !email || !phoneNumber) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    c_firstname: firstName,
                    c_lastname: lastName,
                    email: email,
                    c_phonenumber: phoneNumber,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'An error occurred. Please try again.');
                return;
            }

            alert(data.message);
            onAuthSuccess(role);
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="signupContainer">
            <h3>Sign Up</h3>
            <form className="signupForm" onSubmit={handleSignup}>
                <div className="inputGroup">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="Enter your First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Enter your Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter your Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="role">Select Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">Customer</option>
                        <option value="admin">Restaurant Admin</option>
                    </select>
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Not used yet in backend
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Sign Up
                </button>
            </form>
            {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
            <div className="loginRedirect">
                <p>Already have an account?</p>
                <button onClick={switchToLogin} className="btn btn-primary">
                    Login
                </button>
            </div>
        </div>
    );
};

export default Signup;
