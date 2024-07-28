import React, {useState} from 'react';
import UserInfo from './user-account/UserInfo';
import MySetsBox from './user-account/MySetsBox';
import '../styles/AccountPage.css';

const AccountPage = ({ user }) => {
    const [appUser, setAppUser] = useState(user || {});

    const updateUser = (updateUser) => {
        setAppUser(updateUser);
    };

    if (!user || !user.userId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-account-page">
            <div className="my-account-page-center">
                <div className="left-column">
                    <UserInfo user={appUser} updateUser={updateUser} />
                </div>
                <div className="right-column">
                    <MySetsBox user={appUser} />
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
