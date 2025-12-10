import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('mydb.db');

const UserService = {
  list: () => {
    return db.prepare('SELECT id, name, email, verified, role FROM users').all();
  },

  get: (id) => {
    return db.prepare('SELECT id, name, email, verified, role FROM users WHERE id = ?').get(id);
  },

  create: async ({ name, email, password, role }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Défaut au rôle "association" si non fourni
      role = role || 'association';
      const stmt = db.prepare(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
      );
      const info = stmt.run(name, email, hashedPassword, role);
      return { id: info.lastInsertRowid, name, email, role };
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
      throw err;
    }
  },

  update: ({ id, name, email, role }) => {
    try {
      const stmt = db.prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?');
      stmt.run(name, email, role, id);
    } catch (err) {
      console.error('Erreur mise à jour utilisateur:', err);
      throw err;
    }
  },

  delete: (id) => {
    try {
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      stmt.run(id);
    } catch (err) {
      console.error('Erreur suppression utilisateur:', err);
      throw err;
    }
  }
};

export default UserService;

