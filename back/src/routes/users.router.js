import { Hono } from 'hono';
import db from '../db.js'; 

const usersRouter = new Hono();

usersRouter.get('/', (c) => {
  try {
    // récupère tous les utilisateurs vérifiés
    const users = db
      .prepare('SELECT id, name, email, verified FROM users WHERE verified = 1')
      .all();
    return c.json(users);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

export default usersRouter;
