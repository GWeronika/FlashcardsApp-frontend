import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ setsPerPage, totalSets, currentPage, onPageChange }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalSets / setsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        const visiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        let endPage = Math.min(totalPages, startPage + visiblePages - 1);

        if (endPage - startPage < visiblePages - 1) {
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        return pageNumbers.slice(startPage - 1, endPage).map(number => (
            <button
                key={number}
                onClick={() => onPageChange(number)}
                className={number === currentPage ? 'active' : ''}
            >
                {number}
            </button>
        ));
    };

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <i className="fa-solid fa-angles-left"></i>
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="fa-solid fa-angle-left"></i>
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i className="fa-solid fa-angle-right"></i>
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <i className="fa-solid fa-angles-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
