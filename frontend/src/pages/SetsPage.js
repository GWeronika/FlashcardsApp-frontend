import React, {useCallback, useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import '../styles/SetsPage.css';

const SetsPage = ({ isLoggedIn, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOption, setFilterOption] = useState('Latest');
    const [showMySets, setShowMySets] = useState(false);
    const setsPerPage = 12;

    const fetchSets = useCallback(async (showMySets, ascending = true, searchTerm = '') => {
        try {
            let url;
            if (searchTerm) {
                url = `/api/set/search?searchTerm=${searchTerm}`;
            } else if (showMySets && isLoggedIn && currentUser && currentUser.userId) {
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
                const setsWithFlashcards = await Promise.all(setsData.map(async (set) => {
                    const flashcardsResponse = await fetch(`/api/flashcard/select/setid?setId=${set.setId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (flashcardsResponse.ok) {
                        set.flashcards = await flashcardsResponse.json();
                    }
                    return set;
                }));
                setSets(setsWithFlashcards);
            } else {
                console.error('Failed to fetch sets');
            }
        } catch (error) {
            console.error('Error fetching sets:', error);
        }
    }, [isLoggedIn, currentUser]);

    useEffect(() => {
        const ascending = filterOption === 'Oldest';
        fetchSets(showMySets, ascending, searchTerm);
    }, [filterOption, showMySets, searchTerm, fetchSets]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSetClick = (set) => {
        console.log(`Set ${set.setId} clicked`);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const handleMySetsClick = () => {
        setShowMySets(true);
    };

    const handleAllSetsClick = () => {
        setShowMySets(false);
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
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
            {isLoggedIn && currentUser && (
                <div className="actions-div">
                    <div className="filter-div">
                        <label>
                            Filter
                            <select value={filterOption} onChange={handleFilterChange}>
                                <option value="Latest">Latest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </label>
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
                            {set.flashcards && set.flashcards.map((flashcard, index) => (
                                <div key={index} className="flashcard-set">
                                    <h3>{flashcard.word}</h3>
                                    <div>{flashcard.description}</div>
                                </div>
                            ))}
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
