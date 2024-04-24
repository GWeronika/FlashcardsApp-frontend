import React from 'react';

const TextBox = ({ value, onChange }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
        />
    );
}

export default TextBox;
