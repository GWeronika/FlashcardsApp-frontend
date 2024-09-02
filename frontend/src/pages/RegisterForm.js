import React, { useState } from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";
import TextField from "@mui/material/TextField";

const RegisterForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username || !email || !password || !repeat_password) {
            alert("Please fill in all the fields.");
            return;
        }
        if (password !== repeat_password) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await fetch('/api/user/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                body: new URLSearchParams({
                    name: username,
                    email: email,
                    password: password,
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("User registered successfully. Go to log in.");
            onClose();
        } catch (error) {
            alert(`Failed to register user: ${error.message}`);
        }
    };

    return (
        <div className="login-form-container change-color">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Register</h2>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                />
                <TextField
                    label="RepeatPassword"
                    variant="outlined"
                    value={repeat_password}
                    onChange={handleRepeatPasswordChange}
                    fullWidth
                    required
                />
                <div className="change-color-button">
                    <Button text={<>Register</>} onClick={() => console.log('Button clicked')} />
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
