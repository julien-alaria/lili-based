// src/db.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// chemin vers le fichier SQLite existant
const dbPath = path.join(__dirname, '..', 'mydb.db');

const db = new Database(dbPath);

export default db;
