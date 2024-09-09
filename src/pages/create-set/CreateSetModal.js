import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import '../../styles/CreateSetForm.css';
import TextField from "@mui/material/TextField";
import NewCategoryPage from "./NewCategoryPage";

const CreateSetModal = ({ isOpen, title, setName, setDescription, setCategory, onSetNameChange,
                            onSetDescriptionChange, onSetCategoryChange, onSubmit, onCancel,
                        }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(setCategory || '');
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/category/select/all');
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return;
            }
            const categoriesData = await response.json();
            setCategories(categoriesData);
        } catch (error) {
            console.error(`Failed to fetch categories: ${error.message}`);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        onSetCategoryChange(e);
    };

    return (
        <div className="create-form-container">
            <div className="modal">
                <div className="login-form-icon">
                    <i className="fa-solid fa-square-plus"></i>
                </div>
                <h2>{title}</h2>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={setName}
                    onChange={onSetNameChange}
                    fullWidth
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={setDescription}
                    onChange={onSetDescriptionChange}
                    multiline
                    fullWidth
                />
                <select
                    value={selectedCategory || ''}
                    onChange={handleCategoryChange}
                >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => setIsNewCategoryModalOpen(true)}>New category</button>
                <div className="modal-buttons">
                    <Button text="Submit" onClick={onSubmit} />
                    <Button text="Cancel" onClick={onCancel} />
                </div>
                {isNewCategoryModalOpen && (
                    <NewCategoryPage
                        onClose={() => setIsNewCategoryModalOpen(false)}
                        onCategoryCreated={() => {
                            fetchCategories();
                            setIsNewCategoryModalOpen(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateSetModal;
