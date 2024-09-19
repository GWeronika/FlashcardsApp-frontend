import React, { useState } from 'react';
import '../../styles/ResetPasswordForm.css';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import crayonsImage from "../../images/crayons.png";

const ResetPasswordForm = ({ show, handleClose }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });

    const checkUserExists = async (email) => {
        try {
            const response = await fetch(`/api/user/select/email?email=${encodeURIComponent(email)}`, {
                method: 'GET',
            });

            if (response.ok) {
                const user = await response.json();
                if (user && user.userId) {
                    return user;
                }
            } else if (response.status === 404) {
                alert('User does not exist.');
            }
            return null;
        } catch (error) {
            alert('User does not exist.');
            return null;
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const user = await checkUserExists(email);
        if (!user) {
            setIsLoading(false);
            return;
        }

        setUserId(user.userId);

        try {
            const response = await fetch(`/api/reset/password?email=${encodeURIComponent(email)}`, {
                method: 'GET',
            });

            if (response.ok) {
                setStep(2);
            } else {
                const errorMessage = await response.text();
                alert(errorMessage || 'Error sending verification code');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/reset/code?email=${encodeURIComponent(email)}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.verificationCode === verificationCode) {
                    alert('Verification successful. Now you can reset your password.');
                    setStep(3);
                } else {
                    alert('Verification code is incorrect.');
                }
            } else {
                alert('Error verifying the code');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error verifying the code');
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

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();

        validatePassword(newPassword);

        if (newPassword !== repeatPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (userId === null) {
            alert('User ID not found.');
            return;
        }

        try {
            const response = await fetch(`/api/user/edit/password?id=${userId}&password=${encodeURIComponent(newPassword)}`, {
                method: 'PUT',
            });

            if (response.ok) {
                alert('Password successfully reset');
                handleClose();
            } else {
                alert('Error resetting password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error resetting password');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="reset-password-form">
                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="login-form-icon new-category-icon">
                            <img src={crayonsImage} alt="Crayons illustration" className="login-image" />
                        </div>
                        <div className="form-one"><h2>Reset Password</h2></div>
                        <div className="reset-info-text">You will receive a verification code on the entered email address</div>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 255 }}
                        />
                        {!isLoading ? (
                            <div className="button-container">
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    sx={{ borderColor: '#359E9E', color: '#359E9E' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleEmailSubmit}
                                    sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                                >
                                    Send code
                                </Button>
                            </div>
                        ) : (
                            <div className="loading-container">
                                <div className="spinner">
                                    <i className="fa-solid fa-gear"></i>
                                </div>
                            </div>
                        )}
                    </form>
                ) : step === 2 ? (
                    <form onSubmit={handleVerificationSubmit}>
                        <div className="login-form-icon new-category-icon">
                            <img src={crayonsImage} alt="Crayons illustration" className="login-image" />
                        </div>
                        <div className="form-one"><h2>Verify Code</h2></div>
                        <div className="reset-info-text">If you did not receive the code, please check your spam folder</div>
                        <TextField
                            id="code"
                            label="Verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 1000 }}
                        />
                        <div className="button-container">
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ borderColor: '#359E9E', color: '#359E9E' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleVerificationSubmit}
                                sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                            >
                                Verify
                            </Button>
                        </div>
                    </form>
                ) : step === 3 ? (
                    <form onSubmit={handlePasswordResetSubmit}>
                        <div className="login-form-icon new-category-icon">
                            <img src={crayonsImage} alt="Crayons illustration" className="login-image" />
                        </div>
                        <div className="form-one"><h2>Reset Password</h2></div>
                        <div className="reset-info-text">If you did not receive the code, please check your spam folder</div>
                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            required
                            error={!!errors.username}
                            helperText={errors.username}
                            inputProps={{ maxLength: 255 }}
                        />
                        <TextField
                            id="repeat"
                            type="password"
                            label="Repeat"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 255 }}
                        />
                        <div className="button-container">
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ borderColor: '#359E9E', color: '#359E9E' }}
                            >
                                CANCEL
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePasswordResetSubmit}
                                sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                            >
                                SAVE
                            </Button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    );
};

export default ResetPasswordForm;
