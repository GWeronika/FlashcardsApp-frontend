import React, { useState } from 'react';

const ChangePasswordModal = ({ user, onClose, onSave }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

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
        if (newPassword !== repeatPassword) {
            setError('New passwords do not match');
            return;
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
                        setError('Error updating password');
                    }
                } else {
                    setError('Old password is incorrect');
                }
            } else {
                setError('Error verifying old password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Error changing password');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Change Password</h2>
                <div className="modal-field">
                    <label>
                        Current Password:
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                    </label>
                    <label>
                        Repeat New Password:
                        <input
                            type="password"
                            value={repeatPassword}
                            onChange={handleRepeatPasswordChange}
                        />
                    </label>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={handleSave}>Confirm</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
