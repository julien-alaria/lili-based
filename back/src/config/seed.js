import db from './database.js';

async function seed() {
  // Nettoyage (optionnel)
  await db.exec(`
    DELETE FROM booking_beneficiary;
    DELETE FROM booking;
    DELETE FROM beneficiary;
    DELETE FROM availability;
    DELETE FROM restaurant;
    DELETE FROM restaurateurs;
    DELETE FROM associations;
    DELETE FROM users;
  `);

  // 1. Users
  await db.exec(`
    INSERT INTO users (email, password, name, role, verified) VALUES
    ('admin@example.com', 'password_hash_admin', 'Admin', 'admin', 1),
    ('asso@example.com',  'password_hash_asso',  'Asso 1', 'association', 1),
    ('resto@example.com', 'password_hash_resto', 'Resto 1', 'restaurateur', 1);
  `);

  // 2. Associations (associée à user asso)
  await db.exec(`
    INSERT INTO associations (user_id, raison_sociale, ville, code_postal)
    VALUES (2, 'Association Solidarité', 'Paris', '75001');
  `);

  // 3. Restaurateurs (associé à user resto)
  await db.exec(`
    INSERT INTO restaurateurs (user_id, raison_sociale, ville, code_postal, type_cuisine)
    VALUES (3, 'Restaurant du Coeur', 'Paris', '75002', 'Française');
  `);

  // 4. Restaurant
  await db.exec(`
    INSERT INTO restaurant (restaurateur_id, type, takeaway_stock, onsite_stock)
    VALUES (1, 'principal', 20, 10);
  `);

  // 5. Disponibilités
  await db.exec(`
    INSERT INTO availability (restaurateur_id, date, hour, takeaway_count, onsite_count)
    VALUES
    (1, '2025-12-15', '12:00', 10, 5),
    (1, '2025-12-15', '19:00', 10, 5);
  `);

  // 6. Bénéficiaires
  await db.exec(`
    INSERT INTO beneficiary (association_id, name, birthdate)
    VALUES
    (1, 'Jean Dupont', '1980-01-01'),
    (1, 'Marie Curie', '1990-05-10');
  `);

  // 7. Réservation
  await db.exec(`
    INSERT INTO booking (restaurant_id, association_id, availability_id, takeaway_count, onsite_count)
    VALUES (1, 1, 1, 4, 2);
  `);

  // 8. Lien réservation ↔ bénéficiaires
  await db.exec(`
    INSERT INTO booking_beneficiary (booking_id, beneficiary_id)
    VALUES (1, 1), (1, 2);
  `);

  console.log('✅ Seed terminé');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
