import React, { useState } from 'react';
import '../styles/CreateSetForm.css';

const CreateSetsForm = () => {
    const [setName, setSetName] = useState('');
    const [setDescription, setSetDescription] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({
        word: '',
        definition: '',
        isFavourite: false
    });
    const [flashcards, setFlashcards] = useState([]);

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
            definition: value
        }));
    };

    const handleAddFlashcard = (e) => {
        e.preventDefault();
        setFlashcards([...flashcards, newFlashcard]);
        setNewFlashcard({ word: '', definition: '', isFavourite: false });
    };

    return (
        <div className="create-form-container">
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
                    rows={1}
                />
            </div>
            <form onSubmit={handleAddFlashcard} className="create-form">
                <input
                    type="text"
                    placeholder="Word"
                    value={newFlashcard.word}
                    onChange={handleSetWordChange}
                />
                <input
                    type="text"
                    placeholder="Definition"
                    value={newFlashcard.definition}
                    onChange={handleSetDefinitionChange}
                />
                <span
                    className={`star ${newFlashcard.isFavourite ? 'is-favourite' : ''}`}
                    onClick={() => setNewFlashcard({ ...newFlashcard, isFavourite: !newFlashcard.isFavourite })}
                    title="Add to favorites"
                    aria-label="Add to favorites"
                >
                    <div className="tooltip">Add to favourites</div>
                    &#9733;
                </span>
                <button type="submit">Add Flashcard</button>
            </form>
            <div className="created-div">
                <div className="flashcard-container">
                    {flashcards.map((flashcard, index) => (
                        <div key={index} className="flashcard">
                            <div className="flashcard-item">
                                <div className="flashcard-title">Word:</div>
                                <div className="flashcard-value">{flashcard.word}</div>
                            </div>
                            <div className="flashcard-item">
                                <div className="flashcard-title">Definition:</div>
                                <div className="flashcard-value">{flashcard.definition}</div>
                            </div>
                            <span className={`star ${flashcard.isFavourite ? 'is-favourite' : ''}`}>&#9733;</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateSetsForm;
