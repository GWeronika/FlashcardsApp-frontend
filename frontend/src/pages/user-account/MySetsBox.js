import React from 'react';
import SetsPage from '../SetsPage';

const MySetsBox = ({ user }) => {
    return (
        <div className="my-sets-box">
            <h2>My Sets</h2>
            <SetsPage isLoggedIn={true} currentUser={user} hideActions={true} mySetsOnly={true} />
        </div>
    );
};

export default MySetsBox;
