import React from 'react';
import UserInfo from './user-account/UserInfo';
import MySetsBox from './user-account/MySetsBox';
import '../styles/AccountPage.css';

const AccountPage = ({ user }) => {
    return (
        <div className="my-account-page">
            <div className="my-account-page-center">
                <div className="left-column">
                    <UserInfo user={user} />
                </div>
                <div className="right-column">
                    <MySetsBox user={user} />
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
