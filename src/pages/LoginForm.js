import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";
import ResetPasswordForm from "./password-reset/ResetPasswordForm";
import TextField from '@mui/material/TextField';
import loginImage from '../images/log-in-image.webp';

const LoginForm = ({ onClose, onLogin, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });

    const handleUsernameChange = (event) => {
        const newUsername = event.target.value;
        setUsername(newUsername);
        validateUsername(newUsername);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleForgotPasswordClick = () => {
        setForgotPasswordOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        validateUsername(username);
        validatePassword(password);

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

    const validateUsername = (username) => {
        if (!username.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username is required.' }));
        } else if (username.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username cannot exceed 255 characters.' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, username: '' }));
        }
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!password.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required.' }));
        } else if (password.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password cannot exceed 255 characters.' }));
        } else if (!passwordPattern.test(password)) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password does not meet the requirements.' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
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
                    <img src={loginImage} alt="Login illustration" className="login-image" />
                </div>
                <h2>Log in</h2>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username}
                    slotProps={{ input: { maxLength: 255 } }}
                />
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    slotProps={{ input: { maxLength: 255 } }}
                />
                <Button text="LOG IN" />
                <div className="login-form-options">
                    <div className="login-form-option">
                        <label htmlFor="register">
                            Don't have an account?
                            <button
                                type="button"
                                onClick={onRegister}
                                className="link-button"
                            >
                                Register
                            </button>
                        </label>
                    </div>
                    <div className="login-form-option">
                        <label htmlFor="forgot-password">
                            Forgot your password?
                            <button
                                type="button"
                                onClick={handleForgotPasswordClick}
                                className="link-button"
                            >
                                Forgot password
                            </button>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
