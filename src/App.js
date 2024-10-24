import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar'; // Import the SearchBar component

const App = () => {
    const [car_owners, setCar_owners] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // State for search results
    const [newData, setNewData] = useState({
        owner_name: '',
        car_number: '',
        contact_number: '',
        email: '',
        address: '',
        company: '',
        department: '',
        aadhar_id: ''
    });

    useEffect(() => {
        fetchCarOwners(); // Fetch car owners on component mount
    }, []);

    const fetchCarOwners = () => {
        axios.get('http://localhost:5000/api/car_owners')
            .then(response => {
                setCar_owners(response.data);
                setSearchResults(response.data); // Set initial search results
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleSearch = (car_number) => {
        axios.get('http://localhost:5000/api/search', { 
            params: { query: car_number }  // Pass car_number as a query parameter
        })
        .then(response => setSearchResults(response.data))  // Set the response data (filtered car owners)
        .catch(error => console.error('Error searching data:', error));
    };

    const handleAddData = () => {
        if (Object.values(newData).some(value => !value)) {
            alert("All fields are required!");
            return;
        }

        const qrCodeDataUrl = `https://example.com/car/${newData.car_number}`;

        axios.post('http://localhost:5000/api/car_owners', { ...newData, barcode: qrCodeDataUrl })
            .then(response => {
                fetchCarOwners(); // Refresh the car owners list after adding a new entry
                setNewData({
                    owner_name: '',
                    car_number: '',
                    contact_number: '',
                    email: '',
                    address: '',
                    company: '',
                    department: '',
                    aadhar_id: ''
                });
            })
            .catch(error => console.error('Error adding data:', error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/car_owners/${id}`)
            .then(() => {
                fetchCarOwners(); // Refresh the list after deletion
            })
            .catch(error => console.error('Error deleting data:', error));
    };

    return (
        <div className="App">
            <div className="form-container">
                <h1>Car DataBase</h1>
                <h2>Add New Data</h2>
                {/* Form fields for adding new car owner */}
                <input
                    type="text"
                    placeholder="Owner Name"
                    value={newData.owner_name}
                    onChange={(e) => setNewData({ ...newData, owner_name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Car Number"
                    value={newData.car_number}
                    onChange={(e) => setNewData({ ...newData, car_number: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Contact Number"
                    value={newData.contact_number}
                    onChange={(e) => setNewData({ ...newData, contact_number: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={newData.email}
                    onChange={(e) => setNewData({ ...newData, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={newData.address}
                    onChange={(e) => setNewData({ ...newData, address: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Company"
                    value={newData.company}
                    onChange={(e) => setNewData({ ...newData, company: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={newData.department}
                    onChange={(e) => setNewData({ ...newData, department: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Aadhar ID"
                    value={newData.aadhar_id}
                    onChange={(e) => setNewData({ ...newData, aadhar_id: e.target.value })}
                />
                <button onClick={handleAddData}>Add Data</button>
            </div>

            <div className="database-container">
                <h2>Existing Database</h2>
                <div className="search-bar-container">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <ul>
                    {(searchResults.length > 0 ? searchResults : car_owners).map((data) => (
                        <li key={data.id} className="list-item">
                            <div className="item-details">
                                <p><strong>Owner Name:</strong> {data.owner_name}</p>
                                <p><strong>Car Number:</strong> {data.car_number}</p>
                                <p><strong>Contact Number:</strong> {data.contact_number}</p>
                                <p><strong>Email:</strong> {data.email}</p>
                                <p><strong>Address:</strong> {data.address}</p>
                                <p><strong>Company:</strong> {data.company}</p>
                                <p><strong>Department:</strong> {data.department}</p>
                                <p><strong>Aadhar ID:</strong> {data.aadhar_id}</p>
                            </div>
                            {data.barcode && (
                                <div className="qr-code-container">
                                    <img
                                        src={data.barcode}
                                        alt={`QR code for ${data.car_number}`}
                                        className="qr-code-image"
                                    />
                                </div>
                            )}
                            <button className="delete-button" onClick={() => handleDelete(data.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
