import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';
import './Expenses.css';

const Expenses = () => {
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/expenses', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setExpenses(response.data);
      calculateTotal(response.data);
      setFetchError('');
    } catch (err) {
      setFetchError('Error fetching expenses');
    }
  };

  // Calculate total expenses
  const calculateTotal = (expenses) => {
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    setTotal(totalAmount);
  };

  // Submit new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!personName || personName.length > 100) {
      return setError('Invalid person name');
    }
    if (isNaN(amount) || amount <= 0) {
      return setError('Amount must be a positive number');
    }
    if (!expenseDate || isNaN(Date.parse(expenseDate))) {
      return setError('Invalid expense date');
    }

    try {
      await axios.post('http://localhost:3000/expenses', {
        person_name: personName,
        amount: parseFloat(amount),
        expense_date: expenseDate,
        description,
      });
      // Refresh the expense list after submission
      fetchExpenses();
      // Clear form fields
      setPersonName('');
      setAmount('');
      setExpenseDate('');
      setDescription('');
      setSuccess('Expense added successfully!');
      // Close the modal
      setIsModalOpen(false);
    } catch (err) {
      setError('Error adding expense');
    }
  };

  useEffect(() => {
    fetchExpenses();
    // Polling every 5 seconds
    const intervalId = setInterval(fetchExpenses, 5000);
    return () => clearInterval(intervalId);
  }, [startDate, endDate]);

  // Download PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add a logo (Replace with your logo's URL or base64 data)
    doc.addImage(logo, 'PNG', 14, 10, 30, 30); // Position and scale the logo

    // Company Name at the center
    doc.setFontSize(18);
    doc.text('Eduserv Education Agency', doc.internal.pageSize.width / 2, 20, {
      align: 'center',
    });

    // Report heading
    const reportTitle =
      startDate && endDate
        ? `Expense Report from ${new Date(
            startDate
          ).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
        : `Expense Report as of ${new Date().toLocaleDateString()}`;
    doc.setFontSize(16);
    doc.text(reportTitle, doc.internal.pageSize.width / 2, 40, {
      align: 'center',
    });

    // Table of expenses
    doc.autoTable({
      head: [['Person Name', 'Amount', 'Expense Date', 'Description']],
      body: expenses.map((expense) => [
        expense.person_name,
        `$${expense.amount.toFixed(2)}`,
        new Date(expense.expense_date).toLocaleDateString(),
        expense.description,
      ]),
      startY: 50, // Start below the heading
    });

    // Total expenses at the bottom
    doc.text(
      `Total Expenses: $${total.toFixed(2)}`,
      14,
      doc.autoTable.previous.finalY + 10
    );

    // Save the PDF
    doc.save('expense_report.pdf');
  };

  // Currency format
  const formatCurrency = (amount) => {
    return `shs ${amount.toLocaleString()}`;
  };

  return (
    <div className='expenses-component'>
      <div className='heading'>
        <h2>Manage Expenses</h2>
      </div>

      {/* Success and Error messages */}
      {success && <div className='success-message'>{success}</div>}
      {error && <div className='error-message'>{error}</div>}
      {fetchError && <div className='error-message'>{fetchError}</div>}

      {/* Add Expense Button */}
      <button onClick={() => setIsModalOpen(true)} className='submit-button'>
        Add Expense
      </button>

      {/* Modal for Adding Expense */}
      {isModalOpen && (
        <div className='overlay' onClick={() => setIsModalOpen(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>Add New Expense</div>
            <div className='modal-body'>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='personName'>Person Name</label>
                  <input
                    type='text'
                    id='personName'
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='amount'>Amount</label>
                  <input
                    type='number'
                    id='amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='expenseDate'>Expense Date</label>
                  <input
                    type='date'
                    id='expenseDate'
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button type='submit' className='submit-button'>
                  Submit
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className='table-container'>
        <table className='expense-table'>
          <thead>
            <tr>
              <th>Person Name</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.person_name}</td>
                <td>{formatCurrency(expense.amount)}</td>
                <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Expenses */}
      <div>
        <h3>Total Expenses: {formatCurrency(total)}</h3>
      </div>

      {/* Download PDF Button */}
      <button onClick={downloadPDF} className='submit-button'>
        Download PDF
      </button>
    </div>
  );
};

export default Expenses;
