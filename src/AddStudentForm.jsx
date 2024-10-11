import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddStudentForm.css'; // Import the CSS file for styling

const AddStudentForm = ({ fetchStudents = () => {} }) => {
  // Default function
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contacts, setContacts] = useState('');
  const [status, setStatus] = useState('not completed');
  const [isonloan, setIsOnLoan] = useState(false);
  const [programId, setProgramId] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch programs from backend when component loads
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('http://localhost:3000/programs');
        setPrograms(res.data);
      } catch (err) {
        setError('Error fetching programs.');
      }
    };
    fetchPrograms();
  }, []);

  // Handle program selection change
  const handleProgramChange = (e) => {
    const selectedProgramId = e.target.value;
    setProgramId(selectedProgramId);

    // Find the selected program from the list and set the tuition fee
    const selectedProgram = programs.find(
      (program) => program.id === parseInt(selectedProgramId)
    );
    if (selectedProgram) {
      setTuitionFee(selectedProgram.tuition_fee);
    } else {
      setTuitionFee(''); // Reset tuition fee if no program is selected
    }
  };

  const addStudent = async (student) => {
    try {
      await axios.post('http://localhost:3000/api/students', student);
      fetchStudents(); // Call the function to refresh the student list
      setMessage('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Error adding student. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate inputs
    if (!firstname || !lastname || !contacts || !programId) {
      setError('Firstname, Lastname, Contacts, and Program are required');
      return;
    }

    // Prepare student data including the program and tuition fee
    const studentData = {
      firstname,
      lastname,
      contacts,
      status: status || 'not completed',
      isonloan: isonloan || false,
      program_id: programId, // Send the selected program ID
    };

    // Call the function to add the student
    addStudent(studentData);

    // Reset form fields
    setFirstname('');
    setLastname('');
    setContacts('');
    setStatus('not completed');
    setIsOnLoan(false);
    setProgramId('');
    setTuitionFee('');
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit} className='add-student-form'>
        <h2>Add Student</h2>

        {error && <div className='error-message'>{error}</div>}
        {message && <div className='success-message'>{message}</div>}

        <div className='form-group'>
          <label>First Name</label>
          <input
            type='text'
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label>Last Name</label>
          <input
            type='text'
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label>Contacts</label>
          <input
            type='text'
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            required
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='form-input'
          >
            <option value='completed'>Completed</option>
            <option value='travelled'>Travelled</option>
            <option value='not completed'>Not Completed</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Program</label>
          <select
            value={programId}
            onChange={handleProgramChange}
            required
            className='form-input'
          >
            <option value=''>Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.program_name}
              </option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <label>Tuition Fee</label>
          <input
            type='text'
            value={tuitionFee}
            readOnly
            className='form-input'
            placeholder='Tuition fee will auto-fill based on program'
          />
        </div>

        <div className='form-group'>
          <label>
            <input
              type='checkbox'
              checked={isonloan}
              onChange={(e) => setIsOnLoan(e.target.checked)}
            />
            Is On Loan
          </label>
        </div>

        <button type='submit' className='submit-button'>
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
