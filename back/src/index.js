import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'
import usersRouter from './routes/users.router.js'
import associationsRouter from './routes/associations.router.js';
import { authGuard } from './middlewares/authguard.js'

const app = new Hono()

// Autoriser le front à faire des requêtes
app.use('/api/*', cors({
  origin: '*', // Ou 'http://localhost:5173' pour restreindre
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.use('/api/associations/*', authGuard())
app.route('/', router)
// Brancher le router users sous /api/users
app.route('/api/users', usersRouter)
app.route('/api/associations', associationsRouter);
const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
