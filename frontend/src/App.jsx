import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ApprovalList from './components/ApprovalList';

const API_URL = 'http://localhost:3001';

// Hardcoded users to simulate login
const USERS = {
  '1': { id: 1, name: 'Alice (Manager)', role: 'manager' },
  '2': { id: 2, name: 'Bob (Employee)', role: 'employee', manager_id: 1 },
  '3': { id: 3, name: 'Charlie (Employee)', role: 'employee', manager_id: 1 }
};

function App() {
  const [currentUser, setCurrentUser] = useState(USERS['2']);
  const [myExpenses, setMyExpenses] = useState([]);
  const [teamExpenses, setTeamExpenses] = useState([]);

  const fetchData = useCallback(async () => {
    if (currentUser.role === 'employee') {
      const response = await fetch(`${API_URL}/expenses/employee/${currentUser.id}`);
      const data = await response.json();
      setMyExpenses(data.data);
    } else if (currentUser.role === 'manager') {
      const response = await fetch(`${API_URL}/expenses/manager/${currentUser.id}`);
      const data = await response.json();
      setTeamExpenses(data.data);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserChange = (event) => {
    setCurrentUser(USERS[event.target.value]);
  };

  return (
    <div className="app-container">
      <div className="user-switcher">
        <label htmlFor="user-select">Current User</label>
        <select id="user-select" value={currentUser.id} onChange={handleUserChange}>
          {Object.values(USERS).map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {currentUser.role === 'employee' && (
        <Dashboard title="Employee Dashboard">
          <ExpenseForm userId={currentUser.id} refreshData={fetchData} />
          <ExpenseList expenses={myExpenses} />
        </Dashboard>
      )}

      {currentUser.role === 'manager' && (
        <Dashboard title="Manager Dashboard">
          <ApprovalList expenses={teamExpenses} refreshData={fetchData} />
        </Dashboard>
      )}
    </div>
  );
}

export default App;