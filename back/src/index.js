// import { serve } from '@hono/node-server'
// import { Hono } from 'hono'
// import { cors } from 'hono/cors'
// import router from './routes/index.js'
// const app = new Hono()

// app.use('/api/*', cors())
// app.route('/', router)
// const port = 3000
// console.log(`Server is running on http://localhost:${port}`)

// serve({
//   fetch: app.fetch,
//   port
// })

// back/src/index.js
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'

const app = new Hono()

// Autoriser le front à faire des requêtes
app.use('/api/*', cors({
  origin: '*', // Ou 'http://localhost:5173' pour restreindre
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))

app.route('/', router)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
