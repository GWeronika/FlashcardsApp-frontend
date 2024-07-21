import React, { useCallback, useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import OptionsSetPage from './OptionsSetPage';
import '../styles/SetsPage.css';

const SetsPage = ({ isLoggedIn, currentUser, hideActions, mySetsOnly }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sets, setSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOption, setFilterOption] = useState('Latest');
    const [showMySets, setShowMySets] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);

    const setsPerPage = 12;

    const fetchSets = useCallback(async (showMySets, ascending = true, searchTerm = '') => {
        try {
            let url;
            if(mySetsOnly === true) {
                if (mySetsOnly) {
                    if (isLoggedIn && currentUser && currentUser.userId) {
                        url = `/api/set/select/userid?userID=${currentUser.userId}`;
                    } else {
                        console.error('User is not logged in or user ID is not available');
                        return;
                    }
                }
            } else {
                url = searchTerm
                    ? `/api/set/search?searchTerm=${searchTerm}`
                    : showMySets && isLoggedIn && currentUser && currentUser.userId
                        ? `/api/set/select/userid?userID=${currentUser.userId}`
                        : `/api/set/sort-date?ascending=${ascending}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const setsData = await response.json();
            const setsWithFlashcards = await Promise.all(setsData.map(async (set) => {
                const flashcardsResponse = await fetch(`/api/flashcard/select/setid?setId=${set.setId}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

                if (flashcardsResponse.ok) {
                    set.flashcards = await flashcardsResponse.json();
                } else {
                    console.error('Failed to fetch flashcards');
                }
                return set;
            }));

            setSets(setsWithFlashcards);
        } catch (error) {
            console.error('Error fetching sets:', error);
        }
    }, [isLoggedIn, currentUser, mySetsOnly]);



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
        setSelectedSet(set);
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

    const handleCloseOptions = () => {
        setSelectedSet(null);
    };

    const indexOfLastSet = currentPage * setsPerPage;
    const indexOfFirstSet = indexOfLastSet - setsPerPage;
    const currentSets = sets.slice(indexOfFirstSet, indexOfLastSet);

    return (
        <div className="sets-page-container">
            {selectedSet && <div className="modal-backdrop"></div>}
            {!hideActions && (
                <div className="search-div">
                    <input
                        type="text"
                        placeholder="Search collection..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={() => console.log(" ")}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            )}
            {isLoggedIn && currentUser && !hideActions && (
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
            {selectedSet && (
                <OptionsSetPage
                    selectedSet={selectedSet}
                    onClose={handleCloseOptions}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default SetsPage;
