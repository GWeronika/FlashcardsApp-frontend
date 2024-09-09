import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const NewCategoryPage = ({ onClose, onCategoryCreated }) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleCategoryNameChange = (e) => setNewCategoryName(e.target.value);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('Category name cannot be empty');
            return;
        }

        try {
            const response = await fetch('/api/categories/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                alert('Failed to create category');
                return;
            }

            onCategoryCreated();
            setNewCategoryName('');
        } catch (error) {
            console.error(`Failed to create category: ${error.message}`);
            alert('Failed to create category');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="new-category-modal">
                <h2>Create New Category</h2>
                <TextField
                    label="Category Name"
                    variant="outlined"
                    value={newCategoryName}
                    onChange={handleCategoryNameChange}
                    fullWidth
                />
                <div className="modal-buttons">
                    <Button onClick={handleCreateCategory}>Create</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default NewCategoryPage;
