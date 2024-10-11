import React, { useState } from 'react';
import './StudentTable.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const StudentsOnLoan = ({ students, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Filter students who are on loan and based on search term
  const filteredStudents = students
    .filter((student) => student.isonloan) // Only students who are on loan
    .filter(
      (student) =>
        student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.contacts.includes(searchTerm)
    );

  if (loading) {
    return <p>Loading students on loan...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='table-container'>
      <h2>Students On Loan</h2>
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
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.contacts}</td>
                <td>{student.status}</td>
                <td>{student.program_name}</td>
                <td>{student.tuition_fee}</td>
                <td>{student.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='7'>No students on loan found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsOnLoan;
