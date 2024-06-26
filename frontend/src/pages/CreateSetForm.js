import React, { useState, useEffect } from 'react';
import '../styles/CreateSetForm.css';
import Button from "../components/Button";

const CreateSetsForm = ({ isLoggedIn, currentUser, onRedirect, onRedirectToSetsPage }) => {
    const [setName, setSetName] = useState('');
    const [setDescription, setSetDescription] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({
        word: '',
        description: ''
    });
    const [flashcards, setFlashcards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [setObject, setSetObject] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            alert("To create a set, an account is required.");
            setTimeout(onRedirect, 500);
        }
    }, [isLoggedIn, onRedirect]);

    const handleSetNameChange = (e) => {
        setSetName(e.target.value);
    };

    const handleSetDescriptionChange = (e) => {
        const { value } = e.target;
        setSetDescription(value);
    };

    const handleSetWordChange = (e) => {
        const { value } = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            word: value
        }));
    };

    const handleSetDefinitionChange = (e) => {
        const { value } = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            description: value
        }));
    };

    const handleAddFlashcard = async (e) => {
        e.preventDefault();
        if (!setObject) {
            alert("Set object is not available. Create a set first.");
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setFlashcards([...flashcards, newFlashcard]);
            setNewFlashcard({ word: '', description: '' });
        } catch (error) {
            alert(`Failed to add flashcard: ${error.message}`);
        }
    };

    const handleCreateSet = async () => {
        if (setName.trim() !== '' && setDescription.trim() !== '') {
            setIsModalOpen(false);
            const params = new URLSearchParams();
            params.append('name', setName);
            params.append('date', new Date().toISOString().split('T')[0]);
            params.append('description', setDescription);
            params.append('userJson', JSON.stringify(currentUser));

            try {
                const response = await fetch('/api/set/add/description', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: params.toString()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setSetObject(result);
            } catch (error) {
                alert(`Failed to add set: ${error.message}`);
            }
        }
    };

    const handleConfirmFlashcard = () => {
        handleUpdateSet();
        alert("Successfully added");
        onRedirectToSetsPage();
    };

    const handleFlashcardClick = (index) => {
        console.log(`Clicked on flashcard ${index}`);
    };

    const handleUpdateSet = async () => {
        if (setObject) {
            const updateNameParams = new URLSearchParams();
            updateNameParams.append('id', setObject.setId);
            updateNameParams.append('newName', setName);

            const updateDescriptionParams = new URLSearchParams();
            updateDescriptionParams.append('id', setObject.setId);
            updateDescriptionParams.append('description', setDescription);

            try {
                const responseName = await fetch(`/api/set/edit?${updateNameParams.toString()}`, {
                    method: 'GET',
                });

                const responseDescription = await fetch(`/api/set/edit/description?${updateDescriptionParams.toString()}`, {
                    method: 'GET',
                });

                if (!responseName.ok || !responseDescription.ok) {
                    throw new Error(`HTTP error! status: ${responseName.status}, ${responseDescription.status}`);
                }
            } catch (error) {
                alert(`Failed to update set: ${error.message}`);
            }
        }
    };

    return (
        <div className="create-form-container">
            {isModalOpen && (
                <div className="modal">
                    <h2>Create new set</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={setName}
                        onChange={handleSetNameChange}
                    />
                    <textarea
                        placeholder="Description"
                        value={setDescription}
                        onChange={handleSetDescriptionChange}
                        rows={1}
                    />
                    <Button text={<>Create</>} onClick={handleCreateSet} />
                </div>
            )}
            {!isModalOpen && (
                <>
                    <div className="create-form-inner">
                        <div className="name-form">
                            <input
                                type="text"
                                placeholder="Set Name"
                                value={setName}
                                onChange={handleSetNameChange}
                            />
                            <textarea
                                placeholder="Description"
                                value={setDescription}
                                onChange={handleSetDescriptionChange}
                                rows={3}
                            />
                        </div>
                        <div className="create-form">
                            <input
                                type="text"
                                placeholder="Word"
                                value={newFlashcard.word}
                                onChange={handleSetWordChange}
                            />
                            <input
                                type="text"
                                placeholder="Definition"
                                value={newFlashcard.description}
                                onChange={handleSetDefinitionChange}
                            />
                            <div className="create-form-buttons">
                                <Button text={<>Add</>} onClick={handleAddFlashcard} />
                                <Button text={<>Finish</>} onClick={handleConfirmFlashcard} />
                            </div>
                        </div>
                    </div>
                    <div className="flashcard-container">
                        {flashcards.map((flashcard, index) => (
                            <button key={index} className="flashcard" onClick={() => handleFlashcardClick(index)}>
                                <h3 className="flashcard-title">{flashcard.word}</h3>
                                <p className="flashcard-description">{flashcard.description}</p>
                                <div className="flashcard-options">
                                    <i className="fa-solid fa-trash-can"></i>
                                    <i className="fa-solid fa-pen"></i>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateSetsForm;
