// // SearchBar.js
// import React, { useState } from 'react';

// const SearchBar = ({ onSearch }) => {
//     const [searchTerm, setSearchTerm] = useState('');

//     const handleSearch = () => {
//         onSearch(searchTerm);
//     };

//     return (
//         <div className="search-bar">
//             <input
//                 type="text"
//                 placeholder="Search by Car Number"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button onClick={handleSearch}>Search</button>
//         </div>
//     );
// };

// export default SearchBar;



import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Car Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
