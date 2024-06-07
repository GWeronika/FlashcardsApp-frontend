import React, { useEffect, useState } from 'react';
import '../styles/SetsPage.css';

const SetsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);

    useEffect(() => {
        fetchSets();
    }, []);

    const fetchSets = async () => {
        try {
            const response = await fetch('/api/set/select/all', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const setsData = await response.json();
                setSets(setsData);
            } else {
                console.error('Failed to fetch sets');
            }
        } catch (error) {
            console.error('Error fetching sets:', error);
        }
    };

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
                {sets.map((set) => (
                    <div key={set.setId} className="set-box">
                        <div className="set-title">{set.name}</div>
                        <div className="set-description">{set.description}</div>
                        {/*<div className="flashcards">*/}
                        {/*    {set.flashcards.map((flashcard, index) => (*/}
                        {/*        <div key={index} className="flashcard">*/}
                        {/*            <div>{flashcard.word}</div>*/}
                        {/*            <div>{flashcard.description}</div>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SetsPage;
