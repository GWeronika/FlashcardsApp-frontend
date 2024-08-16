import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";

const LoginForm = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                alert('Login successful.');
                onLogin(userData);
                onClose();
            } else if (response.status === 401) {
                alert('Invalid username or password. Please try again.');
            } else {
                console.error('Unexpected response status:', response.status);
                alert('Login unsuccessful. Please try again later.');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Log in</h2>
                <div className="login-form-input">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="login-form-input">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <Button text={<>Log in</>} onClick={() => console.log('Button clicked')} />
                <div className="login-form-options">
                    <div className="login-form-option">
                        <label htmlFor="register">
                            Don't have an account? <a href="/register">Register</a>
                        </label>
                    </div>
                    <div className="login-form-option">
                        <label htmlFor="forgot-password">
                            Forgot your password? <a href="/forgot-password">Forgot password</a>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
