import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import '../../styles/CreateSetForm.css';
import TextField from "@mui/material/TextField";
import NewCategoryPage from "./NewCategoryPage";
import registerImage from "../../images/register-image-blue.png";

const CreateSetModal = ({ isOpen, title, setName, setDescription, setCategory, onSetNameChange,
                            onSetDescriptionChange, onSetCategoryChange, onSubmit, onCancel,
                        }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/category/select/all');
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return;
            }
            const categoriesData = await response.json();

            const uncategorized = categoriesData.find(category => category.name === 'Uncategorized');

            if (uncategorized) {
                setCategories(categoriesData);
                setSelectedCategory(uncategorized.categoryId);
                if (!setCategory) {
                    onSetCategoryChange({ target: { value: uncategorized.categoryId } });
                }
            } else {
                const uncategorizedCategory = { categoryId: 'uncategorized', name: 'Uncategorized' };
                setCategories([...categoriesData, uncategorizedCategory]);
                setSelectedCategory(uncategorizedCategory.categoryId);
                if (!setCategory) {
                    onSetCategoryChange({ target: { value: uncategorizedCategory.categoryId } });
                }
            }
        } catch (error) {
            console.error(`Failed to fetch categories: ${error.message}`);
        }
    }, [onSetCategoryChange, setCategory]);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        onSetCategoryChange(e);
    };

    return (
        <div className="create-form-container">
            <div className="modal">
                <div className="login-form-icon">
                    <img src={registerImage} alt="Create set illustration" className="login-image" />
                </div>
                <h2>{title}</h2>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={setName}
                    onChange={onSetNameChange}
                    fullWidth
                    required
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={setDescription}
                    onChange={onSetDescriptionChange}
                    multiline
                    fullWidth
                    required
                    inputProps={{ maxLength: 1000 }}
                />
                <div className="modal-additional-box">
                    <select
                        value={selectedCategory || ''}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <Button
                        variant="contained"
                        onClick={() => setIsNewCategoryModalOpen(true)}
                        sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                    >
                        New category
                    </Button>
                </div>
                <div className="modal-buttons">
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        sx={{ borderColor: '#359E9E', color: '#359E9E', backgroundColor: '#fff'}}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                    >
                        Create
                    </Button>
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
