import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ApprovalList from './components/ApprovalList';
import FinanceList from './components/FinanceList';
import Login from './components/Login';

const API_URL = 'http://localhost:3001';

const USERS = {
  '1': { id: 1, name: 'Alice (Manager)', role: 'manager' },
  '2': { id: 2, name: 'Bob (Employee)', role: 'employee', manager_id: 1 },
  '3': { id: 3, name: 'Charlie (Employee)', role: 'employee', manager_id: 1 },
  '4': { id: 4, name: 'David (Finance)', role: 'finance' }
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myExpenses, setMyExpenses] = useState([]);
  const [teamExpenses, setTeamExpenses] = useState([]);
  const [financeExpenses, setFinanceExpenses] = useState([]);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    if (currentUser.role === 'employee') {
      const res = await fetch(`${API_URL}/expenses/employee/${currentUser.id}`);
      const data = await res.json();
      setMyExpenses(data.data);
    } else if (currentUser.role === 'manager') {
      const res = await fetch(`${API_URL}/expenses/manager/${currentUser.id}`);
      const data = await res.json();
      setTeamExpenses(data.data);
    } else if (currentUser.role === 'finance') {
      const res = await fetch(`${API_URL}/expenses/finance`);
      const data = await res.json();
      setFinanceExpenses(data.data);
    }
  }, [currentUser]);

  useEffect(() => { if (isLoggedIn) { fetchData(); } }, [isLoggedIn, fetchData]);
  
  const handleLoginSuccess = (user) => {
    setCurrentUser(USERS[user.id]);
    setIsLoggedIn(true);
  };

  // --- NEW LOGOUT FUNCTION ---
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="user-switcher">
        <p>Welcome, {currentUser.name}</p>
        {/* --- NEW LOGOUT BUTTON --- */}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
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

      {currentUser.role === 'finance' && (
        <Dashboard title="Finance Dashboard">
          <FinanceList expenses={financeExpenses} refreshData={fetchData} />
        </Dashboard>
      )}
    </div>
  );
}

export default App;