import React from 'react';
import SetsPage from '../SetsPage';

const MySetsBox = ({ user, onSetClick }) => {
    return (
        <div className="my-sets-box">
            <h2>My Sets</h2>
            <SetsPage isLoggedIn={true} currentUser={user} hideActions={true} mySetsOnly={true} onSetClick={onSetClick} />
        </div>
    );
};

export default MySetsBox;
