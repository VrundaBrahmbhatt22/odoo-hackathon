import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <div className="expense-list-container">
      <h2>My Expense History</h2>
      <ul className="expense-list">
        {expenses.length === 0 && <p>You have not submitted any expenses yet.</p>}
        {expenses.map((expense) => (
          <li key={expense.id} className="list-item">
            <div className="item-details">
              <p className="description">{expense.description}</p>
              <p className="secondary">{expense.currency} {expense.amount.toFixed(2)} on {expense.date}</p>
            </div>
            <span className={`status-chip status-${expense.status}`}>
              {expense.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;