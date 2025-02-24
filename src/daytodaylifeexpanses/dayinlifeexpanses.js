import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dayinlifeexpanses.css';
import AdminDashboard from '../admin-dashboard/admin-dashboard';

const DailyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [cycleEndTime, setCycleEndTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

  // Load today's expenses from backend on mount
  useEffect(() => {
    axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/today')
      .then((response) => {
        setExpenses(response.data);
        // Calculate total amount from fetched expenses
        const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalAmount(total);
      })
      .catch((error) => console.error("Error fetching today's expenses:", error));
  }, []);

  useEffect(() => {
    // Set initial cycle end time when component mounts
    if (!cycleEndTime) {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      setCycleEndTime(nextMidnight);
    }
  }, [cycleEndTime]);

  // Check if cycle has ended; if so, reset local state and optionally the backend state.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (cycleEndTime && now >= cycleEndTime) {
        // Reset for new day locally
        setExpenses([]);
        setTotalAmount(0);
        setCurrentDate(new Date().toLocaleDateString());
        
        // Optionally, call backend reset endpoint if you have one.
        // axios.delete('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/expenses/reset')
        //   .then(() => console.log('Expenses reset on backend'))
        //   .catch((error) => console.error("Error resetting expenses:", error));

        // Set next cycle end time
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);
        setCycleEndTime(nextMidnight);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cycleEndTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      description,
      amount: parseFloat(amount),
      // Timestamp will be set by the backend using LocalDateTime.now()
    };

    axios.post('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/add', newExpense)
      .then((response) => {
        const savedExpense = response.data;
        // Update local state with new expense from backend response
        const updatedExpenses = [...expenses, savedExpense];
        setExpenses(updatedExpenses);
        const updatedTotal = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalAmount(updatedTotal);
        setDescription('');
        setAmount('');
      })
      .catch((error) => console.error("Error adding expense:", error));
  };

  return (
    <>
    <AdminDashboard/>
  
    <div className="daily-expenses-container">
      <div className="expenses-header">
        <h2>Daily Expenses Tracker</h2>
        <div className="date-info">
          <p>Date: {currentDate}</p>
          <p>Cycle ends at: {cycleEndTime?.toLocaleTimeString()}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            placeholder="Expense description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹):</label>
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-list">
        <h3>Today's Expenses:</h3>
        <div className="expense-headers">
          <span>Description</span>
          <span>Amount</span>
          <span>Time</span>
        </div>
        {expenses.length === 0 ? (
          <p className="no-expenses">No expenses recorded today</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <span className="expense-description">{expense.description}</span>
              <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
              <span className="expense-time">
                {new Date(expense.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="total-amount">
        <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
      </div>
    </div>
    </>
  );
};

export default DailyExpenses;
