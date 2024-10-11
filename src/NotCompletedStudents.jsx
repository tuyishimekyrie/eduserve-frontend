import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentTable.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon

const NotCompletedStudents = () => {
  const [students, setStudents] = useState([]); // State to store fetched students
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Fetch students who have not completed
  const fetchNotCompletedStudents = async () => {
    const sql = 'http://localhost:3000/api/students/notcompleted'; // Your API endpoint
    try {
      const response = await axios.get(sql);
      setStudents(response.data); // Set students in state
    } catch (err) {
      setError('Error fetching students who have not completed'); // Handle error
    } finally {
      setLoading(false); // Update loading state
    }
  };

  // useEffect for fetching data and polling
  useEffect(() => {
    fetchNotCompletedStudents(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotCompletedStudents(); // Poll every 5 seconds
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Loading and error handling
  if (loading) {
    return <p>Loading not completed students...</p>;
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
      <h2>Students Who Have Not Completed</h2>
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
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contacts</th>
            <th>Program</th> {/* Program column */}
            <th>Tuition</th> {/* New column for Tuition */}
            <th>Balance</th> {/* New column for Balance */}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.contacts}</td>
                <td>{student.program_name}</td> {/* Display Program Name */}
                <td>{student.tuition_fee}</td> {/* Display Tuition Fee */}
                <td>{student.balance}</td> {/* Display Balance */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>No students found who have not completed.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotCompletedStudents;
