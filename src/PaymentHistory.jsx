import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For generating tables in PDFs
import './PaymentHistory.css';

const PaymentHistory = ({ payments }) => {
  // Format date as MM-DD-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Format numbers with commas and "shs" currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'shs0';
    return `shs${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Group payments by fee type
  const groupPaymentsByFee = (payments) => {
    return payments.reduce((acc, payment) => {
      if (!acc[payment.fee_name]) {
        acc[payment.fee_name] = [];
      }
      acc[payment.fee_name].push(payment);
      return acc;
    }, {});
  };

  const groupedPayments = groupPaymentsByFee(payments);

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Payment History', 20, 10);
    let finalY = 20;

    Object.keys(groupedPayments).forEach((feeType) => {
      const feePayments = groupedPayments[feeType];
      const totalPaid = feePayments.reduce(
        (total, payment) => total + (payment.payment_amount || 0),
        0
      );

      // Add section for each fee type
      doc.text(
        `${feeType} (Total Paid: ${formatCurrency(totalPaid)})`,
        20,
        finalY
      );
      finalY += 10;

      // Generate table for the fee type
      const tableColumn = ['Date of Payment', 'Amount Paid'];
      const tableRows = feePayments.map((payment) => [
        formatDate(payment.payment_date),
        formatCurrency(payment.payment_amount), // Safely handle undefined amounts
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: finalY,
      });

      finalY = doc.autoTable.previous.finalY + 10;
    });

    doc.save('payment_history.pdf');
  };

  return (
    <div className='payment-history-container'>
      <h3>Payment History</h3>
      <table className='payment-history-table'>
        <thead>
          <tr>
            <th>Fee Type</th>
            <th>Amount Paid</th>
            <th>Date of Payment</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedPayments).map((feeType, index) => {
            const feePayments = groupedPayments[feeType];
            const totalPaid = feePayments.reduce(
              (total, payment) => total + (payment.payment_amount || 0),
              0
            );

            return (
              <React.Fragment key={index}>
                <tr className='fee-header'>
                  <td colSpan='3'>
                    <strong>{feeType}</strong> (Total Paid:{' '}
                    {formatCurrency(totalPaid)})
                  </td>
                </tr>
                {feePayments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'even-row' : 'odd-row'}
                  >
                    <td>{payment.fee_name}</td>
                    <td>{formatCurrency(payment.payment_amount)}</td>
                    <td>{formatDate(payment.payment_date)}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <button onClick={downloadPDF} className='download-button'>
        Download PDF
      </button>
    </div>
  );
};

export default PaymentHistory;
