import React from 'react';

const Dashboard = ({ title, children }) => {
  return (
    <div className="dashboard">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Dashboard;