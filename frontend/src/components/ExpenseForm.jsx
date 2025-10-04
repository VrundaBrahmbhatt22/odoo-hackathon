import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

const ExpenseForm = ({ userId, refreshData }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Travel');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const categories = ["Travel", "Food", "Office Supplies", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      employee_id: userId,
      amount: parseFloat(amount),
      category,
      date,
      description,
      currency: 'INR' // For simplicity, we hardcode currency. Could be an input.
    };
    
    try {
      await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      // Reset form and refresh data
      setAmount('');
      setCategory('Travel');
      setDate('');
      setDescription('');
      refreshData();
    } catch (error) {
      console.error('Failed to submit expense:', error);
    }
  };
  
  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <button type="submit">Submit Expense</button>
    </form>
  );
};

export default ExpenseForm;