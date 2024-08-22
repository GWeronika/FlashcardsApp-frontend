import React, { useState } from "react";
import "../../styles/TestPage.css";

const TestPage = ({ selectedSet, onBackClick }) => {
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

        console.log("Incorrect Flashcards: ", incorrect);
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
            {!showResults ? (
                <div className="flashcard-box">
                    <form>
                        {selectedSet.flashcards.map((flashcard, index) => (
                            <div key={index} className="flashcard-row">
                                <div className="flashcard-word">
                                    {languageMode === "en-pl" ? flashcard.word : flashcard.description}
                                </div>
                                <input
                                    className="flashcard-input"
                                    value={userAnswers[flashcard.word] || ""}
                                    onChange={(e) => handleInputChange(e, flashcard.word)}
                                    placeholder="Word"
                                />
                            </div>
                        ))}
                        <button className="finish-btn" onClick={handleFinish}>
                            Finish
                        </button>
                    </form>
                </div>
            ) : (
                <div className="results-box">
                    <div className="results-summary">
                        Correct Answers: {correctCount}/{selectedSet.flashcards.length}
                    </div>
                    {incorrectWords.length > 0 && (
                        <div className="incorrect-list">
                            <div>Incorrect Words:</div>
                            <ul>
                                {incorrectWords.map((flashcard, index) => (
                                    <li key={index}>{`${flashcard.word} - ${flashcard.description}`}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestPage;
