import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentTable.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon

const TravelledStudents = () => {
  const [students, setStudents] = useState([]); // State to store fetched students
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Fetch students who travelled
  const fetchTravelledStudents = async () => {
    const sql = 'http://localhost:3000/api/students/travelled'; // Your API endpoint
    try {
      const response = await axios.get(sql);
      setStudents(response.data); // Set students in state
    } catch (err) {
      setError('Error fetching students who travelled'); // Handle error
    } finally {
      setLoading(false); // Update loading state regardless of success or failure
    }
  };

  // useEffect for fetching data and polling
  useEffect(() => {
    fetchTravelledStudents(); // Initial fetch

    const interval = setInterval(() => {
      fetchTravelledStudents(); // Poll every 5 seconds
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Loading and error handling
  if (loading) {
    return <p>Loading travelled students...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contacts.includes(searchTerm)
  );

  return (
    <div className='table-container'>
      <h2>Students Who Travelled</h2>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search Student..'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-bar'
        />
        <span className='search-icon'>
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      <table className='styled-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contacts</th>
            <th>Status</th>
            <th>Program</th>
            <th>Tuition</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{`${student.firstname} ${student.lastname}`}</td>
                <td>{student.contacts}</td>
                <td>{student.status}</td>
                <td>{student.program_name}</td>
                <td>{student.tuition_fee}</td>
                <td>{student.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>No travelled students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TravelledStudents;
