// back/src/routes/associations.router.js
import { Hono } from 'hono';
import db from '../db.js';

const associationsRouter = new Hono();

// GET all associations
associationsRouter.get('/', (c) => {
  try {
    const associations = db
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
    console.log('GET /associations ->', associations);
    return c.json(associations);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// GET one association by id
associationsRouter.get('/:id', (c) => {
  try {
    const id = c.req.param('id');
    const association = db
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

    console.log(`GET /associations/${id} ->`, association);
    if (!association) return c.json({ error: 'Association non trouvée' }, 404);
    return c.json(association);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// POST create association
associationsRouter.post('/', async (c) => {
  try {
    const {
      user_id,
      raison_sociale,
      siret = null,
      tva = null,
      numero_rue = null,
      rue = null,
      ville = null,
      code_postal = null,
    } = await c.req.json();

    console.log('POST /associations body:', {
      user_id,
      raison_sociale,
      siret,
      tva,
      numero_rue,
      rue,
      ville,
      code_postal,
    });

    if (!user_id || !raison_sociale) {
      return c.json({ error: 'user_id et raison_sociale sont obligatoires' }, 400);
    }

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

    const newAssociation = {
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

    console.log('Association created:', newAssociation);
    return c.json(newAssociation, 201);
  } catch (err) {
    console.error('Erreur création association:', err);
    return c.json({ error: "Impossible de créer l'association" }, 500);
  }
});

// PUT update association
associationsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = db
      .prepare('SELECT * FROM associations WHERE id = ?')
      .get(id);

    if (!existing) {
      return c.json({ error: 'Association non trouvée' }, 404);
    }

    const {
      raison_sociale = existing.raison_sociale,
      siret = existing.siret,
      tva = existing.tva,
      numero_rue = existing.numero_rue,
      rue = existing.rue,
      ville = existing.ville,
      code_postal = existing.code_postal,
    } = body;

    console.log(`PUT /associations/${id} body:`, {
      raison_sociale,
      siret,
      tva,
      numero_rue,
      rue,
      ville,
      code_postal,
    });

    db.prepare(`
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
    `).run(
      raison_sociale,
      siret,
      tva,
      numero_rue,
      rue,
      ville,
      code_postal,
      id
    );

    return c.json({ message: 'Association mise à jour' });
  } catch (err) {
    console.error('Erreur mise à jour association:', err);
    return c.json({ error: "Impossible de mettre à jour l'association" }, 500);
  }
});

// DELETE association
associationsRouter.delete('/:id', (c) => {
  try {
    const id = c.req.param('id');
    const info = db
      .prepare('DELETE FROM associations WHERE id = ?')
      .run(id);

    console.log(`DELETE /associations/${id} ->`, info);

    if (info.changes === 0) {
      return c.json({ error: 'Association non trouvée' }, 404);
    }

    return c.json({ message: 'Association supprimée' });
  } catch (err) {
    console.error('Erreur suppression association:', err);
    return c.json({ error: "Impossible de supprimer l'association" }, 500);
  }
});

export default associationsRouter;
