import React from 'react';
import './FeeDropdown.css'; // Import the CSS file for styles

const FeeDropdown = ({ fees, selectedFee, setSelectedFee }) => {
  return (
    <div className='fee-dropdown-container'>
      <label htmlFor='fee-select' className='fee-label'>
        Fee Type:
      </label>
      <select
        id='fee-select'
        value={selectedFee}
        onChange={(e) => setSelectedFee(e.target.value)}
        required
        className='fee-dropdown'
        aria-label='Select Fee Type'
      >
        <option value=''>Select Fee</option>
        {fees.length > 0 ? (
          fees.map((fee) => (
            <option key={fee.fee_id} value={fee.fee_id}>
              {fee.fee_name} - ${fee.fee_amount.toFixed(2)}
            </option>
          ))
        ) : (
          <option value='' disabled>
            No fees available
          </option>
        )}
      </select>
    </div>
  );
};

export default FeeDropdown;
