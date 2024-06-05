import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";

const RegisterForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Rejestracja...');
        onClose();
    };

    return (
        <div className="login-form-container change-color">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Register</h2>
                <div className="login-form-input">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div className="login-form-input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div className="login-form-input">
                    <label htmlFor="repeat-password">Repeat password:</label>
                    <input type="password" id="repeat-password" value={repeat_password} onChange={handleRepeatPasswordChange} />
                </div>
                <div className="change-color-button">
                    <Button text={<>Register</>} onClick={() => console.log('Button clicked')} />
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
