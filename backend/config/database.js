const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data');
const usersFile = path.join(dbPath, 'users.json');
const budgetsFile = path.join(dbPath, 'budgets.json');

// Ensure data directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, '[]');
}
if (!fs.existsSync(budgetsFile)) {
  fs.writeFileSync(budgetsFile, '[]');
}

class JSONDatabase {
  static readUsers() {
    try {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }

  static readBudgets() {
    try {
      const data = fs.readFileSync(budgetsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static writeBudgets(budgets) {
    fs.writeFileSync(budgetsFile, JSON.stringify(budgets, null, 2));
  }
}

console.log('JSON database initialized');

module.exports = JSONDatabase;