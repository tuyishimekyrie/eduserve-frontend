import React, { useState } from 'react';
import axios from 'axios';
import './CourseForm.css'; // Import your CSS file for styling

const CourseForm = () => {
  const [programName, setProgramName] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!programName.trim())
      errors.programNameName = 'Program name is required.';
    if (!tuitionFee || tuitionFee <= 0)
      errors.tuitionFee = 'Tuition fee must be a positive number.';

    return Object.keys(errors).length === 0;
  };

  const postCourse = async (courseData) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/courses',
        courseData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Server error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Form data
    const courseData = {
      program_name: programName,
      tuition_fee: tuitionFee,
    };

    try {
      await postCourse(courseData);
      setMessage('Course added successfully!');
      setProgramName(''); // Reset form fields
      setTuitionFee('');

      setErrors({});
    } catch (error) {
      setMessage(error.message || 'Failed to add course.');
    }
  };

  return (
    <div className='course-form-container'>
      <h2>Add New Program</h2>
      <form onSubmit={handleSubmit} className='course-form'>
        <div className='form-group'>
          <label htmlFor='courseName'>Program Name:</label>
          <input
            id='programName'
            type='text'
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className={`form-control ${
              errors.programName ? 'input-error' : ''
            }`}
            required
          />
          {errors.programName && (
            <p className='error-message'>{errors.programName}</p>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='tuitionFee'>Tuition Fee:</label>
          <input
            id='tuitionFee'
            type='number'
            value={tuitionFee}
            onChange={(e) => setTuitionFee(e.target.value)}
            className={`form-control ${errors.tuitionFee ? 'input-error' : ''}`}
            required
          />
          {errors.tuitionFee && (
            <p className='error-message'>{errors.tuitionFee}</p>
          )}
        </div>

        <button type='submit' className='submit-button'>
          Add Program
        </button>
        {message && <p className='status-message'>{message}</p>}
      </form>
    </div>
  );
};

export default CourseForm;
