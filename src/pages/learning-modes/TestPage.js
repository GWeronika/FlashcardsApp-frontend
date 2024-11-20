import React, { useState } from "react";
import "../../styles/TestPage.css";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

const TestPage = ({ selectedSet, onBackClick, onAnotherClick }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState([]);
    const [languageMode, setLanguageMode] = useState("en-pl");

    const handleInputChange = (e, word) => {
        setUserAnswers({
            ...userAnswers,
            [word]: e.target.value,
        });
    };

    const handleFinish = () => {
        let correct = 0;
        let incorrect = [];

        selectedSet.flashcards.forEach((flashcard) => {
            const userAnswer = userAnswers[flashcard.word]?.trim();
            let isCorrect;

            if (languageMode === "en-pl") {
                isCorrect = userAnswer === flashcard.description;
            } else {
                isCorrect = userAnswer === flashcard.word;
            }

            if (isCorrect) {
                correct++;
            } else {
                incorrect.push(flashcard);
            }
        });

        setCorrectCount(correct);
        setIncorrectWords(incorrect);
        setShowResults(true);
    };

    const toggleLanguageMode = () => {
        setLanguageMode(prevMode => (prevMode === "en-pl" ? "pl-en" : "en-pl"));
    };

    return (
        <div className="test-page-container">
            <div className="top-bar">
                <Tooltip title="Change language" arrow>
                    <button
                        className="settings-btn"
                        onClick={toggleLanguageMode}
                    >
                        <i className="fa-solid fa-rotate"></i>
                    </button>
                </Tooltip>
                <Tooltip title="Go back" arrow>
                    <button
                        className="back-btn"
                        onClick={onBackClick}
                    >
                        <i className="fa-solid fa-right-long"></i>
                    </button>
                </Tooltip>
            </div>
            {!showResults ? (
                <div className="test-flashcard-box">
                    <p>Fill in the blanks with the appropriate translations</p>
                    <form>
                        {selectedSet.flashcards.map((flashcard, index) => (
                            <div key={index} className="test-flashcard-row">
                                <div className="test-flashcard-word">
                                    {languageMode === "en-pl" ? flashcard.word : flashcard.description}
                                </div>
                                <TextField
                                    className="test-flashcard-input"
                                    label={languageMode === "en-pl" ? "Translation" : "Tłumaczenie"}
                                    variant="outlined"
                                    value={userAnswers[flashcard.word] || ""}
                                    onChange={(e) => handleInputChange(e, flashcard.word)}
                                    slotProps={{ input: { maxLength: 255 } }}
                                />
                            </div>
                        ))}
                    <section><button className="finish-btn" onClick={handleFinish}>FINISH</button></section>
                    </form>
                </div>
            ) : (
                <div className="results-box">
                    <div className="results-summary">
                        Your score is {correctCount}/{selectedSet.flashcards.length}
                    </div>
                    {incorrectWords.length > 0 && (
                        <div className="incorrect-list">
                            <div>INCORRECT WORDS</div>
                            <div className="flashcards">
                                {incorrectWords.map((flashcard, index) => (
                                    <div key={index} className="flashcard-set incorrect-list-result">
                                        <h3>{flashcard.word}</h3>
                                        <div>{flashcard.description}</div>
                                    </div>                                ))}
                            </div>
                            <div className="completion-message">
                                <button onClick={onAnotherClick}>ANOTHER SET</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestPage;
