import React from 'react';
import '../styles/Menu.css';

const Menu = ({ ahr, text }) => {
    return (
        <li><a href={ahr}>{text}</a></li>
    );
}

export default Menu;
