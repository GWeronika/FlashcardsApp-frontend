import React, {useState} from 'react';
import '../styles/LoginForm.css';
import Button from "../components/Button";
import TextField from "@mui/material/TextField";
import registerImage from '../images/register-image.png';

const RegisterForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });

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

        const isUsernameValid = await validateUsername(username);
        const isEmailValid = await validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isRepeatPasswordValid = password === repeat_password;

        if (!isRepeatPasswordValid) {
            alert("Passwords do not match.");
        }

        if (isUsernameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid) {
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
        }
    };

    const validateUsername = async (username) => {
        if (!username.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username is required.' }));
        } else if (username.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username cannot exceed 255 characters.' }));
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
        const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email is required.' }));
            return false;
        } else if (!emailRegex.test(email)) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Invalid email format.' }));
            return false;
        } else if (username.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Email cannot exceed 255 characters.' }));
        }

        const emailExists = await checkEmailInDatabase(email);
        if (emailExists) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email already exists.' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        return true;
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!password.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required.' }));
            return false;
        } else if (!passwordPattern.test(password)) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password does not meet the requirements.' }));
            return false;
        } else if (password.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password cannot exceed 255 characters.' }));
        }
        setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        return true;
    };

    const checkUsernameInDatabase = async (username) => {
        try {
            const response = await fetch('/api/user/select/all');
            const users = await response.json();

            return users.some(user => user.name === username);
        } catch (error) {
            console.error("Error checking username:", error);
            return false;
        }
    };

    const checkEmailInDatabase = async (email) => {
        try {
            const response = await fetch('/api/user/select/all');
            const users = await response.json();

            return users.some(user => user.email === email);
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    };

    return (
        <div className="login-form-container change-color">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-icon register-form-icon">
                    <img src={registerImage} alt="Register illustration" className="login-image" />
                </div>
                <h2>Register</h2>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    required
                    error={!!errors.username}
                    helperText={errors.username}
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    label="Repeat Password"
                    variant="outlined"
                    type="password"
                    value={repeat_password}
                    onChange={handleRepeatPasswordChange}
                    fullWidth
                    required
                    error={password !== repeat_password}
                    helperText={password !== repeat_password ? "Passwords do not match" : ""}
                    inputProps={{ maxLength: 255 }}
                />
                <div className="change-color-button">
                    <Button text={<>REGISTER</>} onClick={() => {}} />
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
