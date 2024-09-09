import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";
import ResetPasswordForm from "./password-reset/ResetPasswordForm";
import TextField from '@mui/material/TextField'; // Import Material UI TextField

const LoginForm = ({ onClose, onLogin, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleForgotPasswordClick = () => {
        setForgotPasswordOpen(true);
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
            {isForgotPasswordOpen && (
                <ResetPasswordForm
                    show={isForgotPasswordOpen}
                    handleClose={() => setForgotPasswordOpen(false)}
                />
            )}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-icon">
                    <i className="fa-solid fa-circle-user"></i>
                </div>
                <h2>Log in</h2>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                />
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                />
                <Button text="Log in" />
                <div className="login-form-options">
                    <div className="login-form-option">
                        <label htmlFor="register">
                            Don't have an account?
                            <a onClick={onRegister}>
                                Register
                            </a>
                        </label>
                    </div>
                    <div className="login-form-option">
                        <label htmlFor="forgot-password">
                            Forgot your password?
                            <a onClick={handleForgotPasswordClick}>
                                Forgot password
                            </a>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
