import React, { useEffect, useState } from 'react';
import '../styles/OptionsSetPage.css';

const OptionsSetPage = ({ selectedSet, onClose, currentUser, onEditSet, onFlashcards, onWrite, onTest }) => {
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await fetch(`/api/flashcard/select/setid?setId=${selectedSet.setId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    const flashcardsData = await response.json();
                    setFlashcards(flashcardsData);
                } else {
                    console.error('Failed to fetch flashcards');
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        };
        if (selectedSet) {
            fetchFlashcards();
        }
    }, [selectedSet]);

    const handleEditClick = () => {
        onEditSet(selectedSet);
    };

    return (
        <div className="options-set-page">
            <div className="set-details">
                <div className="options-set-title set-title">{selectedSet.name}</div>
                <div className="options-set-description set-description">{selectedSet.description}</div>
            </div>
            <div className="options-set-page-bottom">
                <div className="flashcards-set">
                    {flashcards.map((flashcard, index) => (
                        <div key={index} className="flashcard options-flashcard">
                            <h3>{flashcard.word}</h3>
                            <div>{flashcard.description}</div>
                        </div>
                    ))}
                </div>
                <div className="options-set">
                    <button className="option-button" onClick={onFlashcards}>FLASHCARDS</button>
                    <button className="option-button" onClick={onWrite}>WRITE</button>
                    <button className="option-button" onClick={onTest}>TEST</button>
                    {selectedSet.user.userId === currentUser.userId && (
                        <button className="option-button" onClick={handleEditClick}>EDIT</button>
                    )}
                </div>
            </div>
            <div className="close-button-container">
                <button className="close-button" onClick={onClose}>CLOSE</button>
            </div>
        </div>
    );
};

export default OptionsSetPage;
