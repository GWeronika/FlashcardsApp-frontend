import React, { useEffect, useState } from 'react';
import Pagination from './../components/Pagination';
import '../styles/SetsPage.css';

const SetsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const setsPerPage = 12;

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
                const setsWithFirstFlashcard = await Promise.all(setsData.map(async (set) => {
                    const flashcardsResponse = await fetch(`/api/flashcard/select/setid?setId=${set.setId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (flashcardsResponse.ok) {
                        const flashcardsData = await flashcardsResponse.json();
                        set.firstFlashcard = flashcardsData[0];
                    }
                    return set;
                }));
                setSets(setsWithFirstFlashcard);
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastSet = currentPage * setsPerPage;
    const indexOfFirstSet = indexOfLastSet - setsPerPage;
    const currentSets = sets.slice(indexOfFirstSet, indexOfLastSet);

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
                {currentSets.map((set) => (
                    <div key={set.setId} className="set-box">
                        <div className="set-title">{set.name}</div>
                        <div className="set-title set-description">{set.description}</div>
                        <div className="flashcards">
                            {set.firstFlashcard && (
                                <div>
                                    <div className="flashcard">{set.firstFlashcard.word}</div>
                                    <div className="flashcard">{set.firstFlashcard.description}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                setsPerPage={setsPerPage}
                totalSets={sets.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default SetsPage;
