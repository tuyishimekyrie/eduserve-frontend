import React, { useState, useEffect } from 'react';
import './StudentTable.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon
import PaymentModal from './PaymentModal'; // Import your PaymentModal component

const OtherFees = ({ students }) => {
  const [editingId, setEditingId] = useState(null); // Track which student is being edited
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [selectedStudent, setSelectedStudent] = useState(null); // State for the selected student
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      `${student.firstname} ${student.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.contacts.includes(searchTerm)
  );

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedStudent(null); // Reset selected student
  };

  return (
    <div className='table-container'>
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
            <th>Name</th> {/* Combined Name column */}
            <th>Contacts</th>
            <th>Program</th>
            <th>Tuition</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} onClick={() => handleStudentClick(student)}>
              <td>{`${student.firstname} ${student.lastname}`}</td>
              <td>{student.contacts}</td>
              <td>{student.program_name}</td>
              <td>{student.tuition_fee}</td>
              <td>{student.balance}</td>
              <td>
                {editingId === student.id ? (
                  <select
                    value={selectedStatus}
                    className='status-dropdown'
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value='completed'>Completed</option>
                    <option value='travelled'>Travelled</option>
                    <option value='not completed'>Not Completed</option>
                  </select>
                ) : (
                  <span
                    className={`status-label ${student.status.replace(
                      ' ',
                      '-'
                    )}`}
                  >
                    {student.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Modal */}
      {isModalOpen && (
        <PaymentModal student={selectedStudent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OtherFees;
