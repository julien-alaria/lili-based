import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import env from '../config/env.js'
import authService from '../services/auth.service.js'

export function authGuard() {
  return createMiddleware(async (c, next) => {
    const [prefix, token] =
      c.req.header('Authorization')?.split(' ') || [null, undefined]

    if (prefix !== 'Bearer' || !token) {
      return c.json(
        { error: 'You must be authenticated to access this resource' },
        401
      )
    }

    try {
      const decoded = await verify(token, env.JWT_SECRET)
      if (!decoded) {
        return c.json({ error: 'Invalid token' }, 401)
      }

      const user = await authService.findUserByEmail(decoded.email)
      if (!user) {
        // utilisateur introuvable = authentification invalide
        return c.json({ error: 'Invalid token user' }, 401)
      }

      // utilisateur OK ⇒ on le met dans le contexte et on continue
      c.set('user', user)
      await next()
    } catch (error) {
      console.error('authGuard error:', error)
      // ici, erreur de vérification/jwt invalide = 401
      return c.json({ error: 'Invalid or expired token' }, 401)
    }
  })
}
