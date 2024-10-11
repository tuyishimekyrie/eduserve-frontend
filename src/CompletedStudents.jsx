import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentTable.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon

const CompletedStudents = () => {
  const [students, setStudents] = useState([]); // State to store fetched students
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Fetch students who completed
  const fetchCompletedStudents = async () => {
    const sql = 'http://localhost:3000/api/students/completed'; // Your API endpoint
    try {
      const response = await axios.get(sql);
      setStudents(response.data); // Set students in state
      setLoading(false); // Update loading state
    } catch (err) {
      setError('Error fetching students who completed'); // Handle error
      setLoading(false); // Update loading state
    }
  };

  // useEffect for fetching data and setting up polling
  useEffect(() => {
    fetchCompletedStudents(); // Initial fetch

    const interval = setInterval(() => {
      fetchCompletedStudents(); // Fetch data every 10 seconds
    }, 10000); // 10 seconds interval

    // Cleanup function to clear the interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Loading and error handling
  if (loading) {
    return <p>Loading completed students...</p>;
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
      <h2>Students Who Completed</h2>
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
      {filteredStudents.length > 0 ? (
        <table className='styled-table'>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contacts</th>
              <th>Program</th>
              <th>Tuition</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.contacts}</td>
                <td>{student.program_name}</td>
                <td>{student.tuition_fee}</td>
                <td>{student.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students have completed their program yet.</p> // Message when no students completed
      )}
    </div>
  );
};

export default CompletedStudents;
