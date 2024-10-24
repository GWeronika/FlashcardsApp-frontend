import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import loginImage from "../../images/log-in-image.webp";

const EditProfileModal = ({ user, onClose, onSave }) => {
    const [username, setUsername] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [errors, setErrors] = useState({ username: '', email: '' });

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSave = async () => {
        const isUsernameValid = await validateUsername(username);
        const isEmailValid = await validateEmail(email);

        if (isUsernameValid && isEmailValid) {
            try {
                const response = await fetch(`/api/user/edit/profile?id=${user.userId}&name=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    onSave(username, email);
                    onClose();
                } else {
                    console.error('Error updating profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const validateUsername = async (username) => {
        if (username.trim() === user.name) {
            setErrors(prevErrors => ({ ...prevErrors, username: '' }));
            return true;
        }

        if (!username.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username is required.' }));
            return false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, username: '' }));
        }

        const usernameExists = await checkUsernameInDatabase(username);
        if (usernameExists) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username already exists.' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, username: '' }));
        return true;
    };

    const validateEmail = async (email) => {
        if (email.trim() === user.email) {
            setErrors(prevErrors => ({ ...prevErrors, email: '' }));
            return true;
        }

        const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email is required.' }));
            return false;
        } else if (!emailRegex.test(email)) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Invalid email format.' }));
            return false;
        }

        const emailExists = await checkEmailInDatabase(email);
        if (emailExists) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email already exists.' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        return true;
    };

    const checkUsernameInDatabase = async (username) => {
        try {
            const response = await fetch('/api/user/select/all');
            const users = await response.json();
            return users.some(user => user.name === username);
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    };

    const checkEmailInDatabase = async (email) => {
        try {
            const response = await fetch('/api/user/select/all');
            const users = await response.json();
            return users.some(user => user.email === email);
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="login-form-icon">
                    <img src={loginImage} alt="Login illustration" className="login-image" />
                </div>
                <h2>Edit Profile</h2>
                <div className="modal-field">
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={handleUsernameChange}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        inputProps={{ maxLength: 255 }}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        inputProps={{ maxLength: 255 }}
                    />
                </div>
                <div className="edit-modal-buttons">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ borderColor: '#359E9E', color: '#359E9E' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
