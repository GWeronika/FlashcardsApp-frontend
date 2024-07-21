import React from 'react';

const UserInfo = ({ user }) => {
    return (
        <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button className="edit-button">
                <i className="fa-solid fa-pen-to-square"></i>
                Edit profile
            </button>
            <button className="change-password-button">
                <i className="fa-solid fa-key"></i>
                Change password
            </button>
        </div>
    );
};

export default UserInfo;
