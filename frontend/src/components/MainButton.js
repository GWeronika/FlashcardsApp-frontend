import React from 'react';
import '../styles/Button.css';

const MainButton = ({ text }) => {
    return (
        <button className="main-button">{text}</button>
    );
}

export default MainButton;
