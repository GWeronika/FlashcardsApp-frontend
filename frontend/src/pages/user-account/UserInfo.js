import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import '../../styles/UserInfo.css';

const UserInfo = ({ user, updateUser }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleOpenPasswordModal = () => {
        setPasswordModalOpen(true);
    };

    const handleClosePasswordModal = () => {
        setPasswordModalOpen(false);
    };

    const handleSaveProfile = (newUsername, newEmail) => {
        const updatedUser = { ...user, name: newUsername, email: newEmail };
        updateUser(updatedUser);
        handleCloseEditModal();
    };

    const handleSavePassword = () => {
        handleClosePasswordModal();
    };

    if (!user || !user.userId) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button className="edit-button" onClick={handleOpenEditModal}>
                <i className="fa-solid fa-pen-to-square"></i>
                Edit profile
            </button>
            <button className="change-password-button" onClick={handleOpenPasswordModal}>
                <i className="fa-solid fa-key"></i>
                Change password
            </button>
            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveProfile}
                />
            )}
            {isPasswordModalOpen && (
                <ChangePasswordModal
                    user={user}
                    onClose={handleClosePasswordModal}
                    onSave={handleSavePassword}
                />
            )}
        </div>
    );
};

export default UserInfo;
