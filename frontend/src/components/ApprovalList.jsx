import React from 'react';

const API_URL = 'http://localhost:3001';

const ApprovalList = ({ expenses, refreshData }) => {
  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/expenses/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status }),
      });
      refreshData(); // Refresh the list after an update
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="approval-list-container">
      <h2>Team Expenses for Approval</h2>
      <ul className="approval-list">
        {expenses.length === 0 && <p>No pending expenses for your team.</p>}
        {expenses.map((expense) => (
          <li key={expense.id} className="list-item">
            <div className="item-details">
              <p className="description">{expense.description}</p>
              <p className="secondary">{expense.employee_name} - {expense.currency} {expense.amount.toFixed(2)}</p>
            </div>
            <div className="action-buttons">
              <button className="approve-btn" onClick={() => handleUpdateStatus(expense.id, 'approved')}>Approve</button>
              <button className="reject-btn" onClick={() => handleUpdateStatus(expense.id, 'rejected')}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalList;