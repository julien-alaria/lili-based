import db from '../db.js';

const AssociationService = {
  list: () => {
    return db
      .prepare(`
        SELECT
          id,
          user_id,
          raison_sociale,
          siret,
          tva,
          numero_rue,
          rue,
          ville,
          code_postal,
          created_at
        FROM associations
      `)
      .all();
  },

  get: (id) => {
    return db
      .prepare(`
        SELECT
          id,
          user_id,
          raison_sociale,
          siret,
          tva,
          numero_rue,
          rue,
          ville,
          code_postal,
          created_at
        FROM associations
        WHERE id = ?
      `)
      .get(id);
  },

  create: ({
    user_id,
    raison_sociale,
    siret = null,
    tva = null,
    numero_rue = null,
    rue = null,
    ville = null,
    code_postal = null,
  }) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO associations (
          user_id,
          raison_sociale,
          siret,
          tva,
          numero_rue,
          rue,
          ville,
          code_postal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        user_id,
        raison_sociale,
        siret,
        tva,
        numero_rue,
        rue,
        ville,
        code_postal
      );

      return {
        id: info.lastInsertRowid,
        user_id,
        raison_sociale,
        siret,
        tva,
        numero_rue,
        rue,
        ville,
        code_postal,
      };
    } catch (err) {
      console.error('Erreur création association:', err);
      throw err;
    }
  },

  update: ({
    id,
    raison_sociale,
    siret = null,
    tva = null,
    numero_rue = null,
    rue = null,
    ville = null,
    code_postal = null,
  }) => {
    try {
      const stmt = db.prepare(`
        UPDATE associations
        SET
          raison_sociale = ?,
          siret = ?,
          tva = ?,
          numero_rue = ?,
          rue = ?,
          ville = ?,
          code_postal = ?
        WHERE id = ?
      `);

      stmt.run(
        raison_sociale,
        siret,
        tva,
        numero_rue,
        rue,
        ville,
        code_postal,
        id
      );
    } catch (err) {
      console.error('Erreur mise à jour association:', err);
      throw err;
    }
  },

  delete: (id) => {
    try {
      const stmt = db.prepare('DELETE FROM associations WHERE id = ?');
      stmt.run(id);
    } catch (err) {
      console.error('Erreur suppression association:', err);
      throw err;
    }
  },
};

export default AssociationService;
