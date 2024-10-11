import React, { useState, useEffect } from 'react';
import './StudentTable.css';
import './PaymentModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the close icon
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import Modal from 'react-modal'; // Import React Modal
import axios from 'axios';

// Set up the modal's root element
Modal.setAppElement('#root');

const FinancePart = ({ students, updateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student
  const [studentData, setStudentData] = useState(students || []); // Initialize student data
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch the updated student data without blocking the UI
  const fetchStudentData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/students');
      setStudentData(response.data); // Update student data in the background
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false); // Ensure loading is disabled once the request is complete
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchStudentData(); // Fetch initial data

    const interval = setInterval(() => {
      fetchStudentData(); // Periodically refresh the data in the background
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // Filter students based on search term
  const filteredStudents = studentData.filter((student) => {
    const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (typeof student.contacts === 'string' &&
        student.contacts.toLowerCase().includes(searchLower)) || // Assuming contacts is a string
      (Array.isArray(student.contacts) &&
        student.contacts.some((contact) =>
          contact.toLowerCase().includes(searchLower)
        )) // If contacts is an array
    );
  });

  // Function to open modal and set selected student
  const handleStudentClick = (student) => {
    setSelectedStudent(student); // Pass the whole student object
    setIsModalOpen(true);
  };

  // Function to handle close modal with optimistic UI updates
  const handleCloseModal = (updatedStudentData) => {
    setIsModalOpen(false);

    if (updatedStudentData) {
      // Optimistically update the UI with the new student data before fetching
      setStudentData((prevData) =>
        prevData.map((student) =>
          student.id === updatedStudentData.id ? updatedStudentData : student
        )
      );
    }

    // Fetch updated data in the background to ensure accuracy
    fetchStudentData();
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

      {/* Don't block UI with a loading spinner; just fetch in the background */}
      {loading ? (
        <div className='loading-spinner'>Loading data...</div> // Display loading message or skeleton
      ) : (
        <table className='styled-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contacts</th>
              <th>Program</th>
              <th>Tuition</th>
              <th>Balance</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for PaymentForm */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel='Payment Form Modal'
        className='payment-modal'
        overlayClassName='payment-modal-overlay'
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className='close-modal-btn'
          aria-label='Close modal'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {selectedStudent && (
          <PaymentForm
            studentName={`${selectedStudent.firstname} ${selectedStudent.lastname}`}
            balance={selectedStudent.balance}
            studentId={selectedStudent.id}
            closeModal={(updatedStudentData) =>
              handleCloseModal(updatedStudentData)
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default FinancePart;
