import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bearerAuth } from 'hono/bearer-auth'
import authRouter from './auth.router.js'
import { verify } from 'hono/jwt'
import authService from '../services/auth.service.js'
import env from '../config/env.js'
import { authGuard } from '../middlewares/authguard.js'
import usersRouter from './users.router.js'
const app = new Hono()

// Autoriser le frontend à accéder à l'API
app.use('*', cors({ origin: 'http://localhost:5173' }));

app.get('/', (c) => c.text('Hello from Hono!'));

app.get(
  '/authenticated',
  authGuard(),
  (c) => {
    const user = c.get('user')
    return c.text('Authenticated route, hi ' + user.email)
  }
);

app.route('/api/auth', authRouter);
app.route('/api/users', usersRouter);

export default app;
