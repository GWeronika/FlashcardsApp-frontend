import React, { useState, useEffect } from 'react';
import '../styles/CreateSetForm.css';
import Button from "../components/Button";

const CreateSetForm = ({ isLoggedIn, currentUser, onRedirect, onRedirectToSetsPage }) => {
    const [setName, setSetName] = useState('');
    const [setDescription, setSetDescription] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({
        word: '',
        description: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [setObject, setSetObject] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [editingFlashcard, setEditingFlashcard] = useState(null);
    const [, setIsEditingModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            alert("To create a set, an account is required.");
            setTimeout(onRedirect, 500);
        }
    }, [isLoggedIn, onRedirect]);

    useEffect(() => {
        if (setObject) {
            fetchFlashcardsBySetId(setObject.setId);
        }
    }, [setObject]);

    const handleSetNameChange = (e) => {
        setSetName(e.target.value);
    };

    const handleSetDescriptionChange = (e) => {
        const {value} = e.target;
        setSetDescription(value);
    };

    const handleSetWordChange = (e) => {
        const {value} = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            word: value
        }));
    };

    const handleSetDefinitionChange = (e) => {
        const {value} = e.target;
        setNewFlashcard(prevState => ({
            ...prevState,
            description: value
        }));
    };

    const handleAddFlashcard = async () => {
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(setObject)
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            setNewFlashcard({word: '', description: ''});

            await fetchFlashcardsBySetId(setObject.setId);
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
                    console.error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setSetObject(result);
            } catch (error) {
                alert(`Failed to add set: ${error.message}`);
            }
        }
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
                headers: {'Content-Type': 'application/json'}
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            setSetObject(null);
            setSetName('');
            setSetDescription('');
        } catch (error) {
            console.error(`Failed to delete set: ${error.message}`);
        }
    };

    const handleDeleteButtonClick = async () => {
        try {
            onRedirectToSetsPage();
            await handleDeleteFlashcardsInSet();
            await handleDeleteSet();
        } catch (error) {
            console.error(`Failed to delete set and flashcards: ${error.message}`);
        }
    };

    const handleConfirmFlashcard = async () => {
        await updateSetName();
        await updateSetDescription();
        alert("Successfully added and updated");
        onRedirectToSetsPage();
    };

    const updateSetName = async () => {
        if (setName.trim() !== '' && setObject) {
            try {
                const response = await fetch(`/api/set/edit?id=${setObject.setId}&newName=${setName}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
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
                    headers: {'Content-Type': 'application/json'}
                });
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                alert(`Failed to update set description: ${error.message}`);
            }
        }
    };

    const handleDeleteFlashcard = async (flashcardId) => {
        try {
            const response = await fetch(`/api/flashcard/delete?id=${flashcardId}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }

            await fetchFlashcardsBySetId(setObject.setId);
        } catch (error) {
            console.error(`Failed to delete flashcard: ${error.message}`);
        }
    };

    const fetchFlashcardsBySetId = async (setId) => {
        try {
            const response = await fetch(`/api/flashcard/select/setid?setId=${setId}`);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            const flashcardsData = await response.json();
            setFlashcards(flashcardsData);
        } catch (error) {
            console.error(`Failed to fetch flashcards: ${error.message}`);
        }
    };

    const handleUpdateFlashcardConfirm = async () => {
        try {
            const {word, description} = editingFlashcard;
            const response = await fetch(`/api/flashcard/edit?id=${editingFlashcard.flashcardId}&word=${word}&description=${description}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
            }
            alert("Flashcard updated successfully");
            setEditingFlashcard(null);
            await fetchFlashcardsBySetId(setObject.setId);
        } catch (error) {
            alert(`Failed to update flashcard: ${error.message}`);
        }
    };

    const openEditModal = (flashcard) => {
        setEditingFlashcard(flashcard);
        setIsEditingModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingFlashcard(null);
        setIsEditingModalOpen(false);
    };

    return (
        <>
            {editingFlashcard && (
                <div className="modal-overlay">
                    <div className="change-modal">
                        <h2>Edit Flashcard</h2>
                        <input
                            type="text"
                            placeholder="Word"
                            value={editingFlashcard.word}
                            onChange={(e) => setEditingFlashcard({...editingFlashcard, word: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingFlashcard.description}
                            onChange={(e) => setEditingFlashcard({...editingFlashcard, description: e.target.value})}
                        />
                        <div className="modal-buttons">
                            <Button text={<>Update</>} onClick={handleUpdateFlashcardConfirm}/>
                            <Button text={<>Cancel</>} onClick={closeEditModal}/>
                        </div>
                    </div>
                </div>
            )}
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
                        <Button text={<>Create</>} onClick={handleCreateSet}/>
                    </div>
                )}
                {!isModalOpen && (
                    <>
                        <div className="create-form-inner">
                            <div className="name-form">
                                <div className="name-form-left">
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
                                <div className="name-form-right">
                                    <i className="fa-solid fa-trash-can" onClick={handleDeleteButtonClick}></i>
                                </div>
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
                                    <Button text={<>Add</>} onClick={handleAddFlashcard}/>
                                    <Button text={<>Finish</>} onClick={handleConfirmFlashcard}/>
                                </div>
                            </div>
                        </div>
                        <div className="flashcard-container">
                            {flashcards.map((flashcard) => (
                                <div key={flashcard.flashcardId} className="flashcard">
                                    <h3 className="flashcard-title">{flashcard.word}</h3>
                                    <p className="flashcard-description">{flashcard.description}</p>
                                    <div className="flashcard-options">
                                        <i className="fa-solid fa-trash-can"
                                           onClick={() => handleDeleteFlashcard(flashcard.flashcardId)}></i>
                                        <i className="fa-solid fa-pen" onClick={() => openEditModal(flashcard)}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CreateSetForm;