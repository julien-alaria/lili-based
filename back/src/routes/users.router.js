// back/src/routes/users.router.js
import { Hono } from 'hono'
import db from '../db.js'
import bcrypt from 'bcryptjs'

const usersRouter = new Hono()

// GET all users
usersRouter.get('/', (c) => {
  try {
    const users = db
      .prepare('SELECT id, name, email, verified, role FROM users')
      .all()
    console.log('GET /users ->', users)
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
      .prepare('SELECT id, name, email, verified, role FROM users WHERE id = ?')
      .get(id)
    console.log(`GET /users/${id} ->`, user)
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
    const { name, email, password, role } = await c.req.json()
    console.log('POST /users body:', { name, email, password, role })

    if (!name || !email || !password) {
      return c.json({ error: 'Champs manquants' }, 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role || 'association'

    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    )
    const info = stmt.run(name, email, hashedPassword, userRole)

    const newUser = { id: info.lastInsertRowid, name, email, role: userRole }
    console.log('User created:', newUser)

    return c.json(newUser, 201)
  } catch (err) {
    console.error('Erreur création utilisateur:', err)
    return c.json({ error: 'Impossible de créer l’utilisateur' }, 500)
  }
})

// PUT update user
usersRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { name, email, password, verified, role } = await c.req.json()
    console.log(`PUT /users/${id} body:`, { name, email, password, verified, role })

    if (!name || !email) {
      return c.json({ error: 'Champs manquants' }, 400)
    }

    const userRole = role || 'association'
    let query = 'UPDATE users SET name = ?, email = ?, verified = ?, role = ?'
    const params = [name, email, verified ? 1 : 0, userRole]

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = ?'
      params.push(hashedPassword)
    }

    query += ' WHERE id = ?'
    params.push(id)

    db.prepare(query).run(...params)
    console.log(`User ${id} updated`)

    return c.json({ message: 'Utilisateur mis à jour' })
  } catch (err) {
    console.error('Erreur mise à jour utilisateur:', err)
    return c.json({ error: 'Impossible de mettre à jour l’utilisateur' }, 500)
  }
})

// DELETE user
usersRouter.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const info = db.prepare('DELETE FROM users WHERE id = ?').run(id)
    console.log(`DELETE /users/${id} ->`, info)

    if (info.changes === 0) return c.json({ error: 'Utilisateur non trouvé' }, 404)
    return c.json({ message: 'Utilisateur supprimé' })
  } catch (err) {
    console.error('Erreur suppression utilisateur:', err)
    return c.json({ error: 'Impossible de supprimer l’utilisateur' }, 500)
  }
})

export default usersRouter
