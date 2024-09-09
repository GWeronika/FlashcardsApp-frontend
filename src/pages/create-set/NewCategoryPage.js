import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SketchPicker } from 'react-color';

const NewCategoryPage = ({ onClose, onCategoryCreated }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState('rgba(207, 232, 232, 0.76)');
    const colorPickerRef = useRef(null);

    const handleCategoryNameChange = (e) => setNewCategoryName(e.target.value);

    const handleColorChange = (color) => {
        setSelectedColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 0.76)`);
    };

    const handleClickOutside = (event) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
            setShowColorPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('Category name cannot be empty');
            return;
        }

        const formData = new URLSearchParams();
        formData.append('name', newCategoryName);
        formData.append('colour', selectedColor);

        try {
            const response = await fetch('/api/category/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                alert('Failed to create category');
                return;
            }

            onCategoryCreated();
            setNewCategoryName('');
            setSelectedColor('rgba(207, 232, 232, 0.76)');
        } catch (error) {
            console.error(`Failed to create category: ${error.message}`);
            alert('Failed to create category');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="new-category-modal">
                <div className="login-form-icon new-category-icon">
                    <i className="fa-solid fa-palette"></i>
                </div>
                <h2>Create new category</h2>
                <div className="new-category-inputs">
                    <TextField
                        label="Category Name"
                        variant="outlined"
                        value={newCategoryName}
                        onChange={handleCategoryNameChange}
                        fullWidth
                    />
                    <div className="color-picker-container">
                        <div
                            className="color-preview"
                            style={{ backgroundColor: selectedColor }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            {selectedColor !== 'rgba(207, 232, 232, 0.76)'}
                        </div>
                        {showColorPicker && (
                            <div ref={colorPickerRef}>
                                <SketchPicker
                                    color={selectedColor}
                                    onChangeComplete={handleColorChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-buttons">
                    <Button onClick={handleCreateCategory}>Create</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default NewCategoryPage;
