import React, { useState } from 'react';
import axios from 'axios';
import './AddFeeForm.css';

const AddFeeForm = () => {
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const feeData = {
      fee_name: feeName,
      fee_amount: parseFloat(feeAmount),
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/fees',
        feeData
      );

      setMessage(`Fee added successfully! Fee ID: ${response.data.fee_id}`);
      // Clear the form fields
      setFeeName('');
      setFeeAmount('');
    } catch (error) {
      console.error('Error adding fee:', error);
      setMessage('Error adding fee. Please try again.');
    }
  };

  return (
    <div className='add-fee-form'>
      <h2>Add New Fee</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='feeName'>Fee Name:</label>
          <input
            type='text'
            id='feeName'
            value={feeName}
            onChange={(e) => setFeeName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='feeAmount'>Fee Amount:</label>
          <input
            type='number'
            id='feeAmount'
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            required
            min='0'
            step='0.01' // Allow decimal inputs
          />
        </div>
        <button className='submit-button' type='submit'>
          Add Fee
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddFeeForm;
