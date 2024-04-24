import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";

const LoginForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Logowanie...');
        onClose();
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Log in</h2>
                <div className="login-form-input">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div className="login-form-input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                </div>
                <Button text={<>Log in</>} onClick={() => console.log('Button clicked')} />
                <div className="login-form-options">
                    <div className="login-form-option">
                        <label htmlFor="register">Don't have an account? <a href="/register">Register</a></label>
                    </div>
                    <div className="login-form-option">
                        <label htmlFor="forgot-password">Forgot your password? <a href="/forgot-password">Forgot password</a></label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
