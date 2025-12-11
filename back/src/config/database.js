import Database from 'libsql';

const db = new Database('mydb.db');

// Activer les clés étrangères
db.exec(`
  PRAGMA foreign_keys = ON;
`);

// 1. Table des comptes utilisateurs
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  email        TEXT NOT NULL UNIQUE,
  password     TEXT NOT NULL,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('admin', 'association', 'restaurateur')),
  verified     INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

// 2. Associations
db.exec(`
CREATE TABLE IF NOT EXISTS associations (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  raison_sociale TEXT NOT NULL,
  siret          TEXT,
  tva            TEXT,
  numero_rue     TEXT,
  rue            TEXT,
  ville          TEXT,
  code_postal    TEXT,
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// 3. Restaurateurs
db.exec(`
CREATE TABLE IF NOT EXISTS restaurateurs (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id            INTEGER NOT NULL,
  raison_sociale     TEXT NOT NULL,
  siret              TEXT,
  tva                TEXT,
  numero_rue         TEXT,
  rue                TEXT,
  ville              TEXT,
  code_postal        TEXT,
  type_cuisine       TEXT,
  nb_repas_emporte   INTEGER DEFAULT 0,
  nb_repas_sur_place INTEGER DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// 4. Restaurants
db.exec(`
CREATE TABLE IF NOT EXISTS restaurant (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurateur_id INTEGER NOT NULL,
  type            TEXT NOT NULL,
  takeaway_stock  INTEGER DEFAULT 0,
  onsite_stock    INTEGER DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurateur_id) REFERENCES restaurateurs(id) ON DELETE CASCADE
);
`);

// 5. Disponibilités
db.exec(`
CREATE TABLE IF NOT EXISTS availability (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurateur_id INTEGER NOT NULL,
  date            TEXT NOT NULL,
  hour            TEXT NOT NULL,
  takeaway_count  INTEGER NOT NULL DEFAULT 0,
  onsite_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurateur_id) REFERENCES restaurateurs(id) ON DELETE CASCADE
);
`);

// 6. Bénéficiaires
db.exec(`
CREATE TABLE IF NOT EXISTS beneficiary (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  association_id  INTEGER NOT NULL,
  name            TEXT NOT NULL,
  birthdate       TEXT,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);
`);

// 7. Réservations
db.exec(`
CREATE TABLE IF NOT EXISTS booking (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id   INTEGER NOT NULL,
  association_id  INTEGER NOT NULL,
  availability_id INTEGER NOT NULL,
  takeaway_count  INTEGER NOT NULL DEFAULT 0,
  onsite_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id)   REFERENCES restaurant(id)     ON DELETE CASCADE,
  FOREIGN KEY (association_id)  REFERENCES associations(id)   ON DELETE CASCADE,
  FOREIGN KEY (availability_id) REFERENCES availability(id)   ON DELETE CASCADE
);
`);

// 8. Lien réservation ↔ bénéficiaires
db.exec(`
CREATE TABLE IF NOT EXISTS booking_beneficiary (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id     INTEGER NOT NULL,
  beneficiary_id INTEGER NOT NULL,
  FOREIGN KEY (booking_id)     REFERENCES booking(id)     ON DELETE CASCADE,
  FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id) ON DELETE CASCADE
);
`);

export default db;
