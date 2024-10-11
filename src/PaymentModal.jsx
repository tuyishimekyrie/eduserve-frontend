import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeeDropdown from './FeeDropdown';
import PaymentHistory from './PaymentHistory';
import './Modal.css';

const PaymentModal = ({ student, onClose }) => {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [viewingStatement, setViewingStatement] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/fees');
        setFees(response.data);
      } catch (error) {
        console.error('Error fetching fees:', error);
      }
    };

    fetchFees();
    fetchPaymentHistory();
  }, [student.id]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/students/${student.id}/paymentz`
      ); // Update the endpoint to 'paymentz'
      setPaymentHistory(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const paymentData = {
      fee_id: selectedFee,
      payment_amount: paymentAmount,
      payment_date: paymentDate,
      payment_method: paymentMethod,
    };

    console.log('Payment Data:', paymentData); // Log the payment data

    try {
      await axios.post(
        `http://localhost:3000/students/${student.id}/paymentz`,
        paymentData
      );
      setShowSuccessNotification(true); // Show success notification
      setTimeout(() => setShowSuccessNotification(false), 3000);

      // Reset form fields after successful payment
      setSelectedFee('');
      setPaymentAmount('');
      setPaymentDate('');
      setPaymentMethod('Cash'); // Default back to 'Cash'

      fetchPaymentHistory();
      setViewingStatement(false);
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };
  const toggleView = () => {
    setViewingStatement(!viewingStatement);
  };

  return (
    <div>
      <div className='notification-wrapper'>
        {showSuccessNotification && (
          <div className='success-notification'>Payment successful!</div>
        )}
      </div>
      {/* Overlay to darken the background */}
      <div className='modal-overlay' onClick={onClose}></div>
      <div className='modal'>
        <h2 className='modal-title'>
          Make Payment for {student.firstname} {student.lastname}
        </h2>

        {!viewingStatement ? (
          <form onSubmit={handlePaymentSubmit} className='payment-form'>
            <div className='form-group'>
              <FeeDropdown
                fees={fees}
                selectedFee={selectedFee}
                setSelectedFee={setSelectedFee}
              />
            </div>

            <div className='form-group'>
              <label>Payment Amount:</label>
              <input
                type='number'
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label>Payment Date:</label>
              <input
                type='date'
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label>Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className='form-select'
              >
                <option value='Cash'>Cash</option>
                <option value='Credit Card'>Credit Card</option>
                <option value='Bank Transfer'>Bank Transfer</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <div className='form-buttons'>
              <button type='submit' className='btn btn-primary'>
                Pay
              </button>
              <button
                type='button'
                onClick={toggleView}
                className='btn btn-secondary'
              >
                View Statement
              </button>
              <button
                type='button'
                onClick={onClose}
                className='btn btn-cancel'
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <PaymentHistory payments={paymentHistory} />
            <button
              type='button'
              onClick={toggleView}
              className='btn btn-secondary'
            >
              Back to Payment
            </button>
            <button type='button' onClick={onClose} className='btn btn-cancel'>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
