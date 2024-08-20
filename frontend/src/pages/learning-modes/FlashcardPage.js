import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/FlashcardPage.css';

const FlashcardPage = ({ selectedSet }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [unknownCards, setUnknownCards] = useState([]);

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

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleCardClick = () => {
        setShowDescription(!showDescription);
    };

    const handleCardDragEnd = (direction) => {
        if (direction === 'left') {
            setUnknownCards([...unknownCards, flashcards[currentCardIndex]]);
        }

        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowDescription(false);
        } else if (unknownCards.length > 0) {
            setFlashcards(shuffleArray(unknownCards));
            setUnknownCards([]);
            setCurrentCardIndex(0);
        }
    };

    const currentCard = flashcards[currentCardIndex];

    return (
        <div className="flashcard-page-container">
            <div className="top-bar">
                <button className="settings-btn">•••</button>
                <button className="back-btn" onClick={() => window.history.back()}>←</button>
            </div>
            <div className="side-boxes">
                <div className="side-button left" onClick={() => handleCardDragEnd('left')}>
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
                <div className="side-button right" onClick={() => handleCardDragEnd('right')}>
                    <div className="side-button-content">I know</div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardPage;
