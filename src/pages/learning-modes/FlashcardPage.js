import React, { useState } from "react";
import "../../styles/FlashcardPage.css";

const FlashcardPage = ({ selectedSet, onBackClick }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [hoveredSide, setHoveredSide] = useState(null);
    const [languageMode, setLanguageMode] = useState("en-pl");
    const [unlearnedCards, setUnlearnedCards] = useState(selectedSet.flashcards);
    const [learnedCount, setLearnedCount] = useState(0);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleDrop = (known) => {
        if (known) {
            const updatedCards = [...unlearnedCards];
            updatedCards.splice(currentCardIndex, 1);
            setUnlearnedCards(updatedCards);
            setLearnedCount((prevCount) => prevCount + 1);
            if (currentCardIndex >= updatedCards.length) {
                setCurrentCardIndex(0);
            }
        } else {
            const updatedCards = [...unlearnedCards];
            const [movedCard] = updatedCards.splice(currentCardIndex, 1);
            updatedCards.push(movedCard);
            setUnlearnedCards(updatedCards);
        }
        setFlipped(false);
        setHoveredSide(null);
    };

    const handleDragEnd = () => {
        setHoveredSide(null);
    };

    const handleKnowClick = () => {
        handleDrop(true);
    };

    const handleDontKnowClick = () => {
        handleDrop(false);
    };

    const toggleLanguageMode = () => {
        setLanguageMode(languageMode === "en-pl" ? "pl-en" : "en-pl");
        setFlipped(false);
    };

    const totalCards = selectedSet.flashcards.length;
    const flashcard = unlearnedCards[currentCardIndex];
    const frontText = languageMode === "en-pl" ? flashcard?.word : flashcard?.description;
    const backText = languageMode === "en-pl" ? flashcard?.description : flashcard?.word;

    return (
        <div className="flashcard-page-container">
            <div className="top-bar">
                <button
                    className="settings-btn"
                    onClick={toggleLanguageMode}
                    onMouseEnter={() => setHoveredSide("settings")}
                    onMouseLeave={() => setHoveredSide(null)}
                >
                    {hoveredSide === "settings" && <div className="tooltip">Change language</div>}
                    <i className="fa-solid fa-rotate"></i>
                </button>
                <button
                    className="back-btn"
                    onClick={onBackClick}
                    onMouseEnter={() => setHoveredSide("back")}
                    onMouseLeave={() => setHoveredSide(null)}
                >
                    {hoveredSide === "back" && <div className="tooltip">Go back</div>}
                    <i className="fa-solid fa-right-long"></i>
                </button>
            </div>
            <div className="side-boxes">
                <div
                    className={`side-button left ${hoveredSide === "dont-know" ? "hover" : ""}`}
                    onClick={handleDontKnowClick}
                    onDragEnter={() => setHoveredSide("dont-know")}
                    onDragLeave={() => setHoveredSide(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(false)}
                >
                    <div className="side-button-content">I DON'T KNOW</div>
                </div>
                <div
                    className={`flashcard-box ${flipped ? "flipped" : ""}`}
                    draggable
                    onDragEnd={handleDragEnd}
                    onClick={handleFlip}
                >
                    <div className="flashcard-inner">
                        {learnedCount >= totalCards ? (
                            <div className="completion-message message-with-space">
                                <span className="small-text">You have learned all flashcards from this set. </span>
                                <span>Congratulations!</span>
                                <button onClick={onBackClick}>Another set</button>
                            </div>
                        ) : (
                            <>
                                <div className="flashcard-face flashcard-front">{frontText}</div>
                                <div className="flashcard-face flashcard-back">{backText}</div>
                            </>
                        )}
                    </div>
                </div>
                <div
                    className={`side-button right ${hoveredSide === "know" ? "hover" : ""}`}
                    onClick={handleKnowClick}
                    onDragEnter={() => setHoveredSide("know")}
                    onDragLeave={() => setHoveredSide(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(true)}
                >
                    <div className="side-button-content">I KNOW</div>
                </div>
            </div>
            <div className="counter">
                {learnedCount <= totalCards ? (
                    `${learnedCount}/${totalCards}`
                ) : (
                    `${totalCards}/${totalCards}`
                )}
            </div>
        </div>
    );
};

export default FlashcardPage;
