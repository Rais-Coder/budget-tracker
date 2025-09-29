import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';

const Dashboard = ({ user, onLogout }) => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budget', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBudgets(data.data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budget/summary', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSummary(data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleAddBudget = (newBudget) => {
    setBudgets([newBudget, ...budgets]);
    fetchSummary();
  };

  const handleDeleteBudget = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/budget/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setBudgets(budgets.filter(budget => budget._id !== id));
        fetchSummary();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your budgets...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-text">
            Welcome, {user.username}!
          </h1>
          <p>Manage your personal budget</p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div>
          <div className="summary-card">
            <h2>Financial Summary</h2>
            <div className="summary-item">
              <span>Total Income:</span>
              <span className="income">${summary.totalIncome.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Total Expenses:</span>
              <span className="expense">${summary.totalExpense.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Balance:</span>
              <span className="balance">${summary.balance.toFixed(2)}</span>
            </div>
          </div>

          <BudgetForm onBudgetAdded={handleAddBudget} />
        </div>

        <div className="budget-list">
          <h2>Recent Transactions</h2>
          {budgets.length === 0 ? (
            <p>No transactions yet. Add your first income or expense!</p>
          ) : (
            budgets.map(budget => (
              <div key={budget.id} className={`budget-item ${budget.type}`}>
                <div className="budget-item-info">
                  <div className="budget-item-category">
                    {budget.category}
                  </div>
                  {budget.description && (
                    <div className="budget-item-description">
                      {budget.description}
                    </div>
                  )}
                  <small>
                    {new Date(budget.date).toLocaleDateString()}
                  </small>
                </div>
                <div>
                  <span className={`budget-item-amount ${budget.type}`}>
                    {budget.type === 'income' ? '+' : '-'}${budget.amount.toFixed(2)}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;