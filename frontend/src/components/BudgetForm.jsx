import React, { useState } from 'react';

const BudgetForm = ({ onBudgetAdded }) => {
  const [formData, setFormData] = useState({
    category: '',
    type: 'expense',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Budget item added successfully!');
        setFormData({
          category: '',
          type: 'expense',
          amount: '',
          description: ''
        });
        onBudgetAdded(data.data);
      } else {
        setMessage(data.message || 'Error adding budget item');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form">
      <h2>Add New Transaction</h2>
      
      {message && (
        <div style={{ 
          color: message.includes('success') ? 'green' : 'red', 
          marginBottom: '1rem', 
          textAlign: 'center' 
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Food, Salary, Rent"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Description (optional):</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional details"
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;