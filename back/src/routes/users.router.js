// import { Hono } from 'hono';
// import db from '../db.js'; 

// const usersRouter = new Hono();

// usersRouter.get('/', (c) => {
//   try {
//     // récupère tous les utilisateurs vérifiés
//     const users = db
//       .prepare('SELECT id, name, email, verified FROM users WHERE verified = 1')
//       .all();
//     return c.json(users);
//   } catch (error) {
//     console.error(error);
//     return c.json({ error: 'Erreur serveur' }, 500);
//   }
// });

// export default usersRouter;

// back/src/routes/users.router.js
import { Hono } from 'hono'
import db from '../db.js'
import bcrypt from 'bcryptjs'

const usersRouter = new Hono()

// GET all users (optionnel: filtrer par vérifié ou pas)
usersRouter.get('/', (c) => {
  try {
    const users = db
      .prepare('SELECT id, name, email, verified FROM users')
      .all()
    return c.json(users)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET single user by id
usersRouter.get('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const user = db
      .prepare('SELECT id, name, email, verified FROM users WHERE id = ?')
      .get(id)
    if (!user) return c.json({ error: 'Utilisateur non trouvé' }, 404)
    return c.json(user)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// POST create user
usersRouter.post('/', async (c) => {
  try {
    const { name, email, password } = await c.req.json()

    // Hash password avant de stocker
    const hashedPassword = await bcrypt.hash(password, 10)

    const stmt = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    )
    const info = stmt.run(name, email, hashedPassword)

    return c.json({ id: info.lastInsertRowid, name, email }, 201)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Impossible de créer l’utilisateur' }, 500)
  }
})

// PUT update user
usersRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { name, email, password, verified } = await c.req.json()

    let query = 'UPDATE users SET name = ?, email = ?, verified = ?'
    const params = [name, email, verified ? 1 : 0]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = ?'
      params.push(hashedPassword)
    }

    query += ' WHERE id = ?'
    params.push(id)

    const stmt = db.prepare(query)
    stmt.run(...params)

    return c.json({ message: 'Utilisateur mis à jour' })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Impossible de mettre à jour l’utilisateur' }, 500)
  }
})

// DELETE user
usersRouter.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    const info = stmt.run(id)

    if (info.changes === 0)
      return c.json({ error: 'Utilisateur non trouvé' }, 404)

    return c.json({ message: 'Utilisateur supprimé' })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Impossible de supprimer l’utilisateur' }, 500)
  }
})

export default usersRouter

