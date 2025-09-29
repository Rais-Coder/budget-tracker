const db = require('../config/database');

class Budget {
  static async create(budgetData) {
    const { userId, category, type, amount, description } = budgetData;
    
    const budgets = db.readBudgets();
    
    const newBudget = {
      id: Date.now().toString(),
      userId,
      category,
      type,
      amount: parseFloat(amount),
      description: description || '',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    budgets.push(newBudget);
    db.writeBudgets(budgets);
    
    return newBudget;
  }

  static async findByUserId(userId) {
    const budgets = db.readBudgets();
    return budgets
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static async findByIdAndUserId(id, userId) {
    const budgets = db.readBudgets();
    return budgets.find(b => b.id === id && b.userId === userId);
  }

  static async delete(id) {
    const budgets = db.readBudgets();
    const initialLength = budgets.length;
    const filteredBudgets = budgets.filter(b => b.id !== id);
    
    if (filteredBudgets.length < initialLength) {
      db.writeBudgets(filteredBudgets);
      return { deleted: true };
    }
    return { deleted: false };
  }

  static async getSummary(userId) {
    const budgets = db.readBudgets();
    const userBudgets = budgets.filter(b => b.userId === userId);
    
    const totalIncome = userBudgets
      .filter(b => b.type === 'income')
      .reduce((sum, b) => sum + b.amount, 0);
    
    const totalExpense = userBudgets
      .filter(b => b.type === 'expense')
      .reduce((sum, b) => sum + b.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    return {
      totalIncome,
      totalExpense,
      balance
    };
  }
}

module.exports = Budget;