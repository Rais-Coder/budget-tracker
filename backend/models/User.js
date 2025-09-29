const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const users = db.readUsers();
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    db.writeUsers(users);
    
    return { id: newUser.id, username, email };
  }

  static async findByEmail(email) {
    const users = db.readUsers();
    return users.find(u => u.email === email);
  }

  static async findByUsername(username) {
    const users = db.readUsers();
    return users.find(u => u.username === username);
  }

  static async findById(id) {
    const users = db.readUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        email: user.email
      };
    }
    return null;
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;