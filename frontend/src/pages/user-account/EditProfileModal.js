import React, { useState } from 'react';

const EditProfileModal = ({ user, onClose, onSave }) => {
    const [username, setUsername] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/user/edit/profile?id=${user.userId}&name=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                onSave(username, email);
                onClose();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Profile</h2>
                <div className="modal-field">
                    <label className="modal-field-one">
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </label>
                </div>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={handleSave}>Confirm</button>
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
