import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ChangePasswordModal = ({ user, onClose, onSave }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errors, setErrors] = useState({ oldPassword: '', newPassword: '', repeatPassword: '' });

    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    const handleSave = async () => {
        const isNewPasswordValid = validatePassword(newPassword);
        const isRepeatPasswordValid = newPassword === repeatPassword;
        const isOldPasswordValid = oldPassword.trim() !== '';

        if (!isOldPasswordValid) {
            setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Current password is required.' }));
            return;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, oldPassword: '' }));
        }

        if (!isNewPasswordValid) return;
        if (!isRepeatPasswordValid) {
            setErrors(prevErrors => ({ ...prevErrors, repeatPassword: 'New passwords do not match' }));
            return;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, repeatPassword: '' }));
        }

        try {
            const response = await fetch(`/api/user/verify-password?id=${user.userId}&password=${encodeURIComponent(oldPassword)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const isValid = await response.json();
                if (isValid) {
                    const updateResponse = await fetch(`/api/user/edit/password?id=${user.userId}&password=${encodeURIComponent(newPassword)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (updateResponse.ok) {
                        onSave(newPassword);
                        onClose();
                    } else {
                        setErrors(prevErrors => ({ ...prevErrors, general: 'Error updating password' }));
                    }
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Old password is incorrect' }));
                }
            } else {
                setErrors(prevErrors => ({ ...prevErrors, general: 'Error verifying old password' }));
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrors(prevErrors => ({ ...prevErrors, general: 'Error changing password' }));
        }
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!password.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, newPassword: 'New password is required.' }));
            return false;
        } else if (!passwordPattern.test(password)) {
            setErrors(prevErrors => ({ ...prevErrors, newPassword: 'Password does not meet the requirements.' }));
            return false;
        } else if (password.length > 255) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password cannot exceed 255 characters.' }));
        }
        setErrors(prevErrors => ({ ...prevErrors, newPassword: '' }));
        return true;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Change Password</h2>
                <div className="modal-field">
                    <TextField
                        label="Current password"
                        type="password"
                        variant="outlined"
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                        error={Boolean(errors.oldPassword)}
                        helperText={errors.oldPassword}
                        required
                        inputProps={{ maxLength: 255 }}
                    />
                    <TextField
                        label="New password"
                        type="password"
                        variant="outlined"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword}
                        required
                        inputProps={{ maxLength: 255 }}
                    />
                    <TextField
                        label="Repeat password"
                        type="password"
                        variant="outlined"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        error={Boolean(errors.repeatPassword)}
                        helperText={errors.repeatPassword}
                        required
                        inputProps={{ maxLength: 255 }}
                    />
                </div>
                {errors.general && <p className="error-message">{errors.general}</p>}
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

export default ChangePasswordModal;
