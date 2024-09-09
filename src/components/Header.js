import React from 'react';
import '../styles/Menu.css';

const Header = ({ options, onLogoClick }) => {
    return (
        <header>
            <h2 className="logo">
                <img src="/logo.png" alt="Logo" onClick={onLogoClick} style={{ cursor: 'pointer' }} />
            </h2>
            <nav className="menu">
                <ul>
                    {options.map((option, index) => (
                        <li key={index}>
                            <a onClick={option.onClick}>
                                <i className={option.icon} style={{ color: "#919191" }}></i>
                                {" "}{option.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
