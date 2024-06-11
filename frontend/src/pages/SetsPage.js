import React, { useEffect, useState, useCallback } from 'react';
import Pagination from '../components/Pagination';
import '../styles/SetsPage.css';

const SetsPage = ({ isLoggedIn, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOption, setFilterOption] = useState('Latest');
    const [showMySets, setShowMySets] = useState(false);
    const setsPerPage = 12;

    const fetchSets = useCallback(async (showMySets, ascending = true) => {
        try {
            let url;
            if (showMySets && isLoggedIn) {
                url = `/api/set/select/userid?userID=${currentUser.userId}`;
            } else {
                url = `/api/set/sort-date?ascending=${ascending}`;
            }

            const response = await fetch(url, {
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
    }, [isLoggedIn, currentUser.userId]);

    useEffect(() => {
        const ascending = filterOption === 'Latest';
        fetchSets(showMySets, ascending);
    }, [filterOption, showMySets, fetchSets]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        //TODO: filtering logic
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSetClick = (set) => {
        console.log(`Set ${set.setId} clicked`);
    }

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    }

    const handleMySetsClick = () => {
        setShowMySets(true);
    };

    const handleAllSetsClick = () => {
        setShowMySets(false);
    }

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
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
            {isLoggedIn && (
                <div className="actions-div">
                    <div className="filter-div">
                        <label>
                            Filter
                            <select value={filterOption} onChange={handleFilterChange}>
                                <option value="Latest">Latest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </label>
                        <input
                            type="date"
                            onChange={(e) => console.log(`Date filter: ${e.target.value}`)}
                        />
                    </div>
                    <div className="my-sets-div">
                        <button onClick={handleMySetsClick}>
                            <i className="fa-solid fa-book-bookmark"></i> My Sets
                        </button>
                        <button onClick={handleAllSetsClick}>
                            <i className="fa-solid fa-book-bookmark"></i> All Sets
                        </button>
                    </div>
                </div>
            )}
            <div className="sets-div">
                {currentSets.map((set) => (
                    <div key={set.setId} className="set-box" onClick={() => handleSetClick(set)}>
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
