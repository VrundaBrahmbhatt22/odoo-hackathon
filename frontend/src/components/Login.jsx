import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

const Login = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!userId) {
      setError('Please enter a User ID (e.g., 1, 2, or 3)');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId }),
      });
      const result = await response.json();
      if (response.ok) {
        onLoginSuccess(result.data); // Pass the user data up to the App
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="dashboard">
      <h1>Login</h1>
      <form className="expense-form" onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Enter User ID (1, 2, 3 or 4)" 
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;