// backend/src/services/user.service.js
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('mydb.db');

const UserService = {
  list: () => {
    return db.prepare('SELECT id, name, email, verified FROM users').all();
  },

  get: (id) => {
    return db.prepare('SELECT id, name, email, verified FROM users WHERE id = ?').get(id);
  },

  create: async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword);
    return { id: info.lastInsertRowid, name, email };
  },

  update: ({ id, name, email }) => {
    const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    stmt.run(name, email, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
  }
};

export default UserService;

