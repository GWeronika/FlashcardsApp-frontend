import React, { useState } from 'react';
import '../styles/CreateSetForm.css';

const CreateSetsForm = () => {
    const [setName, setSetName] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({
        word: '',
        definition: '',
        isFavourite: false
    });
    const [flashcards, setFlashcards] = useState([]);

    const handleSetNameChange = (e) => {
        setSetName(e.target.value);
    };

    const handleFlashcardChange = (e) => {
        const { name, value } = e.target;
        setNewFlashcard({ ...newFlashcard, [name]: value });
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
            </div>
            <form onSubmit={handleAddFlashcard} className="create-form">
                <input
                    type="text"
                    placeholder="Word"
                    name="word"
                    value={newFlashcard.word}
                    onChange={handleFlashcardChange}
                />
                <input
                    type="text"
                    placeholder="Definition"
                    name="definition"
                    value={newFlashcard.definition}
                    onChange={handleFlashcardChange}
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
