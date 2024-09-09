import React, { useState } from "react";
import "../../styles/WritePage.css";
import TextField from "@mui/material/TextField";

const WritePage = ({ selectedSet, onBackClick }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [languageMode, setLanguageMode] = useState("en-pl");
    const [unlearnedCards, setUnlearnedCards] = useState(selectedSet.flashcards);
    const [learnedCount, setLearnedCount] = useState(0);

    const totalCards = selectedSet.flashcards.length;

    const handleCheck = () => {
        const flashcard = unlearnedCards[currentCardIndex];
        if (userInput.trim() === flashcard.description) {
            setFeedback("Correct!");
            handleDrop(true);
        } else {
            setFeedback(`Incorrect.<br /><br />${flashcard.word} - ${flashcard.description}`);
            handleDrop(false);
        }
    };

    const handleHelp = () => {
        const flashcard = unlearnedCards[currentCardIndex];
        setFeedback(`Correct answer: ${flashcard.description}`);
        handleDrop(false);
    };

    const handleDrop = (known) => {
        const updatedCards = [...unlearnedCards];
        setUserInput("");

        if (known) {
            updatedCards.splice(currentCardIndex, 1);
            setUnlearnedCards(updatedCards);
            setLearnedCount(prevCount => prevCount + 1);
        } else {
            const [movedCard] = updatedCards.splice(currentCardIndex, 1);
            updatedCards.push(movedCard);
            setUnlearnedCards(updatedCards);
        }
    };

    const handleOkClick = () => {
        setFeedback("");
        setCurrentCardIndex(prevIndex => (prevIndex >= unlearnedCards.length ? 0 : prevIndex));
    };

    const toggleLanguageMode = () => {
        setLanguageMode(prevMode => (prevMode === "en-pl" ? "pl-en" : "en-pl"));
    };

    const flashcard = unlearnedCards[currentCardIndex];
    const frontText = languageMode === "en-pl" ? flashcard?.word : flashcard?.description;

    return (
        <div className="write-page-container">
            <div className="top-bar">
                <button
                    className="settings-btn"
                    onClick={toggleLanguageMode}
                >
                    <i className="fa-solid fa-rotate"></i>
                </button>
                <button
                    className="back-btn"
                    onClick={onBackClick}
                >
                    <i className="fa-solid fa-right-long"></i>
                </button>
            </div>
            <div className="flashcard-box write-page-box">
                {learnedCount === totalCards ? (
                    <div className="completion-message message-with-space">
                        <span className="small-text">You have learned all flashcards from this set.</span>
                        <span>Congratulations!</span>
                        <button onClick={onBackClick}>Another set</button>
                    </div>
                ) : (
                    <div className="flashcard-content">
                        <div className="flashcard-word">
                            {feedback ? '' : frontText}
                        </div>
                        {!feedback && (
                            <TextField
                                id="flashcard-input"
                                label={languageMode === "en-pl" ? "Word" : "Słowo"}
                                variant="outlined"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                fullWidth
                            />
                        )}
                        {!feedback && (
                            <button className="check-btn" onClick={handleCheck}>Check</button>
                        )}
                        {feedback && (
                            <div className="feedback-message" dangerouslySetInnerHTML={{ __html: feedback }}></div>
                        )}
                        {feedback && (
                            <button className="ok-btn" onClick={handleOkClick}>OK</button>
                        )}
                    </div>
                )}
                {!feedback && learnedCount !== totalCards && (
                    <div className="help-text" onClick={handleHelp}>I need help!</div>
                )}
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

export default WritePage;