import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './PaymentForm.css';

const PaymentForm = ({ studentId, studentName, balance, closeModal }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalTuitionPaid, setTotalTuitionPaid] = useState(0); // Add state for total tuition paid

  // Function to format numbers with commas
  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-US');
  };

  // Function to format date to "Month Day, Year"
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Submit Payment to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || !paymentDate || !paymentMethod) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/payments', {
        student_id: studentId,
        amount_paid: amountPaid,
        payment_date: paymentDate,
        payment_method: paymentMethod,
      });

      // Update total tuition paid
      setTotalTuitionPaid((prevTotal) => prevTotal + parseFloat(amountPaid));

      // Show success message with delay
      setSuccessMessage('Thank you! Payment successfully processed. ✔️');
      setErrorMessage('');
      setAmountPaid('');
      setPaymentDate('');
      setPaymentMethod('');

      setTimeout(() => {
        setSuccessMessage('');
        closeModal();
      }, 5000); // Hide after 5 seconds
    } catch (error) {
      setErrorMessage(
        'Failed to process payment. Please try again. ' +
          (error.response?.data?.error || error.message)
      );
      setSuccessMessage('');
    }
  };

  // Fetch Payment History and Generate PDF
  const handleViewStatement = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/students/${studentId}/payments`
      );

      const payments = response.data; // Array of payment records
      const totalPaid = payments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount_paid),
        0
      ); // Calculate total tuition paid

      const doc = new jsPDF();
      doc.text(`Payment Statement for ${studentName}`, 20, 20);
      doc.text(`Balance: shs ${formatCurrency(balance)}`, 20, 30); // Use the formatted balance

      // Create the table with payment history
      doc.autoTable({
        head: [['Date', 'Amount Paid', 'Payment Method']],
        body: payments.map((payment) => [
          formatDate(payment.payment_date), // Format date
          `shs ${formatCurrency(payment.amount_paid)}`, // Format amount
          payment.payment_method,
        ]),
        startY: 40,
        theme: 'striped',
      });

      // Add total tuition paid below the table
      doc.text(
        `Total Tuition Paid: shs ${formatCurrency(totalPaid)}`,
        20,
        doc.autoTable.previous.finalY + 10
      );

      // Save the generated PDF
      doc.save(`${studentName}_Payment_Statement.pdf`);
    } catch (error) {
      setErrorMessage('Failed to generate statement. Please try again.');
    }
  };

  return (
    <div className='payment-form'>
      <h2 className='payment-form-title'>
        Payment for {studentName}{' '}
        <span className='balance'>
          (Balance: shs {formatCurrency(balance)})
        </span>
      </h2>

      {errorMessage && (
        <div className='feedback error-message'>
          <i className='error-icon'>⚠️</i> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className='feedback success-message'>
          <i className='success-icon'>✅</i> {successMessage}
        </div>
      )}

      <button
        type='button'
        className='view-statement-btn'
        onClick={handleViewStatement}
      >
        View Statement
      </button>

      <form onSubmit={handleSubmit} className='form-grid'>
        <div className='form-group'>
          <label htmlFor='amountPaid'>Amount Paid</label>
          <input
            type='number'
            id='amountPaid'
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='paymentDate'>Payment Date</label>
          <input
            type='date'
            id='paymentDate'
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='paymentMethod'>Payment Method</label>
          <select
            id='paymentMethod'
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value=''>Select Method</option>
            <option value='cash'>Cash</option>
            <option value='card'>Card</option>
            <option value='bank_transfer'>Bank Transfer</option>
            <option value='online'>Online Payment</option>
          </select>
        </div>

        <button type='submit' className='submit-btn'>
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
