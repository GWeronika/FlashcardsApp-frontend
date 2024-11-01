import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Button2 from '../../components/Button';
import registerImage from "../../images/register-image-blue.png";

const EditSetPage = ({ setObject, onRedirectToSetsPage }) => {
    const [newFlashcard, setNewFlashcard] = useState({ word: '', description: '' });
    const [flashcards, setFlashcards] = useState([]);
    const [editingFlashcard, setEditingFlashcard] = useState(null);
    const [isOptionsListVisible, setIsOptionsListVisible] = useState(false);
    const [setName, setSetName] = useState(setObject?.name || '');
    const [setDescription, setSetDescription] = useState(setObject?.description || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (setObject) {
            fetchFlashcardsBySetId(setObject.setId);
        }
    }, [setObject]);

    const handleSetWordChange = (e) => setNewFlashcard({ ...newFlashcard, word: e.target.value });
    const handleSetDefinitionChange = (e) => setNewFlashcard({ ...newFlashcard, description: e.target.value });
    const handleSetNameChange = (e) => setSetName(e.target.value);
    const handleSetDescriptionChange = (e) => setSetDescription(e.target.value);

    const handleAddFlashcard = async () => {
        if (!setObject) {
            alert('Set object is not available. Create a set first.');
            return;
        }

        const params = new URLSearchParams();
        params.append('word', newFlashcard.word);
        params.append('description', newFlashcard.description);

        try {
            const response = await fetch(`/api/flashcard/add?${params.toString()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(setObject)
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            setNewFlashcard({ word: '', description: '' });

            await fetchFlashcardsBySetId(setObject.setId);
        } catch (error) {
            alert(`Failed to add flashcard: ${error.message}`);
        }
    };

    const fetchFlashcardsBySetId = async (setId) => {
        try {
            const response = await fetch(`/api/flashcard/select/setid?setId=${setId}`);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            const flashcardsData = await response.json();
            setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);
        } catch (error) {
            console.error(`Failed to fetch flashcards: ${error.message}`);
        }
    };

    const handleDeleteFlashcard = async (flashcardId) => {
        try {
            const response = await fetch(`/api/flashcard/delete?id=${flashcardId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }

            await fetchFlashcardsBySetId(setObject.setId);
        } catch (error) {
            console.error(`Failed to delete flashcard: ${error.message}`);
        }
    };

    const handleUpdateFlashcardConfirm = async () => {
        try {
            const { word, description } = editingFlashcard;
            const response = await fetch(
                `/api/flashcard/edit?id=${editingFlashcard.flashcardId}&word=${word}&description=${description}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            setEditingFlashcard(null);
            await fetchFlashcardsBySetId(setObject.setId);
        } catch (error) {
            alert(`Failed to update flashcard: ${error.message}`);
        }
    };

    const handleConfirmFlashcard = async () => {
        if (flashcards.length === 0) {
            alert('Set cannot be empty');
            return;
        }

        await updateSetName();
        await updateSetDescription();
        alert('Successfully added and updated');
        await onRedirectToSetsPage();
    };

    const updateSetName = async () => {
        if (setName.trim() !== '' && setObject) {
            try {
                const response = await fetch(`/api/set/edit?id=${setObject.setId}&newName=${setName}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                alert(`Failed to update set name: ${error.message}`);
            }
        }
    };

    const updateSetDescription = async () => {
        if (setDescription.trim() !== '' && setObject) {
            try {
                const response = await fetch(`/api/set/edit/description?id=${setObject.setId}&description=${setDescription}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                alert(`Failed to update set description: ${error.message}`);
            }
        }
    };

    const openEditModal = (flashcard) => {
        setEditingFlashcard(flashcard);
    };

    const closeEditModal = () => {
        setEditingFlashcard(null);
    };

    const toggleOptionsList = () => {
        setIsOptionsListVisible(prevState => !prevState);
    };

    const handleDeleteFlashcardsInSet = async () => {
        if (!setObject) return;

        try {
            const response = await fetch(`/api/flashcard/select/setid?setId=${setObject.setId}`);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            const flashcardsData = await response.json();

            for (let flashcard of flashcardsData) {
                await handleDeleteFlashcard(flashcard.flashcardId);
            }

            setFlashcards([]);
        } catch (error) {
            console.error(`Failed to delete flashcards: ${error.message}`);
            throw error;
        }
    };

    const handleDeleteSet = async () => {
        try {
            const response = await fetch(`/api/set/delete?id=${setObject.setId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            setSetName('');
            setSetDescription('');
        } catch (error) {
            console.error(`Failed to delete set: ${error.message}`);
        }
    };

    const handleDeleteButtonClick = async () => {
        setIsLoading(true);
        try {
            if (flashcards.length === 0) {
                await handleDeleteSet();
            } else {
                await handleDeleteFlashcardsInSet();
                await handleDeleteSet();
            }

            await onRedirectToSetsPage();
        } catch (error) {
            console.error(`Failed to delete set and/or flashcards: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (allowedTypes.includes(file.type)) {
                await handleFileUpload(file);
            } else {
                alert('Invalid file format. Please select an Excel (.xlsx) file.');
            }
        }
    };

    const handleImportButtonClick = () => {
        document.getElementById('file-input').click();
    };

    const handleFileUpload = async (file) => {
        if (!file || !setObject) {
            alert('No file selected or set not chosen.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('setId', setObject.setId);

        try {
            const response = await fetch('/api/set/import', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                alert('An error occurred while importing the file.');
            } else {
                alert('File imported successfully.');
                await fetchFlashcardsBySetId(setObject.setId);
            }
        } catch (error) {
            console.error(`Failed to upload file: ${error.message}`);
            alert('An error occurred during file upload.');
        }
    };

    return (
        <>
            {editingFlashcard && (
                <div className="modal-overlay">
                    <div className="change-modal">
                        <div className="login-form-icon">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                        <h2>Edit Flashcard</h2>
                        <TextField
                            id="word"
                            label="Word"
                            variant="outlined"
                            value={editingFlashcard.word}
                            required
                            onChange={(e) =>
                                setEditingFlashcard({
                                    ...editingFlashcard,
                                    word: e.target.value
                                })
                            }
                            fullWidth
                            inputProps={{ maxLength: 255 }}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            value={editingFlashcard.description}
                            required
                            onChange={(e) =>
                                setEditingFlashcard({
                                    ...editingFlashcard,
                                    description: e.target.value
                                })
                            }
                            fullWidth
                            inputProps={{ maxLength: 1000 }}
                        />
                        <div className="modal-buttons">
                            <Button
                                variant="outlined"
                                onClick={closeEditModal}
                                sx={{ borderColor: '#359E9E', color: '#359E9E' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleUpdateFlashcardConfirm}
                                sx={{ backgroundColor: '#359E9E', '&:hover': { backgroundColor: '#2c7d7d' } }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                accept=".xlsx"
                onChange={handleFileChange}
            />
            <div className="create-form-container">
                    <>
                        <div className="login-form-icon">
                            <img src={registerImage} alt="Create set illustration" className="login-image" />
                        </div>
                        <div className="create-form-inner">
                            <div className="name-form">
                                <div className="name-form-left">
                                    <TextField
                                        label="Set name"
                                        variant="outlined"
                                        value={setName}
                                        onChange={handleSetNameChange}
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 255 }}
                                    />
                                    <TextField
                                        label="Description"
                                        variant="outlined"
                                        value={setDescription}
                                        onChange={handleSetDescriptionChange}
                                        required
                                        multiline
                                        fullWidth
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                </div>
                                <div className="name-form-right">
                                    <i
                                        className="fa-solid fa-ellipsis-vertical"
                                        onClick={toggleOptionsList}
                                    ></i>
                                    {isOptionsListVisible && (
                                        <div className="options-list">
                                            <button onClick={handleDeleteButtonClick}>Delete set</button>
                                            <button onClick={handleImportButtonClick}>Import set</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="create-form">
                                <TextField
                                    label="Word"
                                    variant="outlined"
                                    value={newFlashcard.word}
                                    onChange={handleSetWordChange}
                                    fullWidth
                                    required
                                    inputProps={{ maxLength: 255 }}
                                />
                                <TextField
                                    label="Definition"
                                    variant="outlined"
                                    value={newFlashcard.description}
                                    onChange={handleSetDefinitionChange}
                                    fullWidth
                                    required
                                    inputProps={{ maxLength: 255 }}
                                />
                                <div className="create-form-buttons">
                                    <Button2
                                        text={<>ADD</>}
                                        onClick={handleAddFlashcard}
                                    />
                                    <Button2
                                        text={<>FINISH</>}
                                        onClick={handleConfirmFlashcard}
                                    />
                                </div>
                            </div>
                        </div>
                        {!isLoading ? (
                            <div className="flashcard-container">
                                {flashcards.map((flashcard) => (
                                    <div
                                        key={flashcard.flashcardId}
                                        className="flashcard"
                                    >
                                        <h3 className="flashcard-title">
                                            {flashcard.word}
                                        </h3>
                                        <p className="flashcard-description">
                                            {flashcard.description}
                                        </p>
                                        <div className="flashcard-options">
                                            <i className="fa-solid fa-trash-can"
                                               onClick={() =>
                                                   handleDeleteFlashcard(
                                                       flashcard.flashcardId
                                                   )
                                               }
                                            ></i>
                                            <i className="fa-solid fa-pen"
                                               onClick={() =>
                                                   openEditModal(flashcard)
                                               }
                                            ></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="loading-container">
                                <div className="spinner">
                                    <i className="fa-solid fa-gear"></i>
                                </div>
                            </div>
                        )}
                    </>
            </div>
        </>
    );
};

export default EditSetPage;
