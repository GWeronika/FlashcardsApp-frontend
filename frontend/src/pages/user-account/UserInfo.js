import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import '../../styles/UserInfo.css';

const UserInfo = ({ user, updateUser }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveProfile = (newUsername, newEmail) => {
        const updatedUser = { ...user, name: newUsername, email: newEmail };
        updateUser(updatedUser);
        handleCloseModal();
    };

    if (!user || !user.userId) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button className="edit-button" onClick={handleOpenModal}>
                <i className="fa-solid fa-pen-to-square"></i>
                Edit profile
            </button>
            <button className="change-password-button">
                <i className="fa-solid fa-key"></i>
                Change password
            </button>
            {isModalOpen && (
                <EditProfileModal
                    user={user}
                    onClose={handleCloseModal}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
};

export default UserInfo;
