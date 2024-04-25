import React, { useState } from 'react';
import '../styles/SetsPage.css';

const SetsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);

    // TODO: pobieranie zbiorów z bazy danych (do zaimplementowania)

    //TODO: obsługa zmiany w polu wyszukiwania
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        //TODO: filtrowanie wyników
    };

    return (
        <div className="sets-page-container">
            <div className="search-div">
                <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={() => console.log("Search sets clicked!")}>
                    <i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div className="sets-div">
                {/*{sets.map((set) => (*/}
                {/*    <div key={set.id} className="set-box">*/}
                {/*        <div className="set-title">{set.title}</div>*/}
                {/*        <div className="set-description">{set.description}</div>*/}
                {/*        <div className="flashcards">*/}
                {/*            {set.flashcards.map((flashcard, index) => (*/}
                {/*                <div key={index} className="flashcard">*/}
                {/*                    <div>{flashcard.question}</div>*/}
                {/*                    <div>{flashcard.answer}</div>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        </div>
    );
};

export default SetsPage;
