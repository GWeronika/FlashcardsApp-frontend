import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/FlashcardPage.css';

const FlashcardPage = ({ selectedSet }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [initialFlashcardsCount, setInitialFlashcardsCount] = useState(0);

    const fetchFlashcards = useCallback(async () => {
        if (!selectedSet || !selectedSet.setId) {
            console.error('selectedSet is undefined or missing setId');
            return;
        }

        try {
            const response = await fetch(`/api/flashcard/select/setid?setId=${selectedSet.setId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const cardsData = await response.json();

            if (Array.isArray(cardsData)) {
                setFlashcards(shuffleArray(cardsData));
                setInitialFlashcardsCount(cardsData.length);
            } else {
                console.error('Unexpected response format:', cardsData);
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }, [selectedSet]);

    useEffect(() => {
        fetchFlashcards();
    }, [fetchFlashcards]);

    useEffect(() => {
        if (flashcards.length === 0) {
            alert("You have successfully learned all flashcards. Congratulations!");
        }
    }, [flashcards]);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleCardClick = () => {
        setShowDescription(!showDescription);
    };

    const handleCardDragEnd = (direction) => {
        if (direction === 'right') {
            const updatedFlashcards = flashcards.filter((_, index) => index !== currentCardIndex);

            setFlashcards(updatedFlashcards);

            if (currentCardIndex < updatedFlashcards.length) {
                setCurrentCardIndex(currentCardIndex);
            } else if (updatedFlashcards.length > 0) {
                setCurrentCardIndex(0);
            }

            setShowDescription(false);
        } else if (direction === 'left') {
            setCurrentCardIndex((prevIndex) =>
                prevIndex < flashcards.length - 1 ? prevIndex + 1 : prevIndex
            );
            setShowDescription(false);
        }
    };

    const currentCard = flashcards[currentCardIndex];
    const learnedCount = initialFlashcardsCount - flashcards.length;

    return (
        <div className="flashcard-page-container">
            <div className="top-bar">
                <button className="settings-btn">•••</button>
                <button className="back-btn" onClick={() => window.history.back()}>←</button>
            </div>
            <div className="counter">
                <h2>{learnedCount}/{initialFlashcardsCount} Learned</h2>
            </div>
            <div className="side-boxes">
                <div
                    className="side-button left"
                    onClick={() => handleCardDragEnd('left')}
                >
                    <div className="side-button-content">I don't know</div>
                </div>
                <div
                    className="flashcard-box"
                    onClick={handleCardClick}
                    draggable
                    onDragEnd={() => handleCardDragEnd(showDescription ? 'right' : 'left')}
                >
                    {currentCard ? (
                        <div className="flashcard-content">
                            {showDescription ? currentCard.description : currentCard.word}
                        </div>
                    ) : (
                        <div className="flashcard-content">No more cards</div>
                    )}
                </div>
                <div
                    className="side-button right"
                    onClick={() => handleCardDragEnd('right')}
                >
                    <div className="side-button-content">I know</div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardPage;
