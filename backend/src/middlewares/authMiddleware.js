import User from '../models/User.js'
import { verifyToken } from '../services/authService.js'
import { toPublicUser } from '../utils/publicUser.js'

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Token não informado.' })
    return
  }

  try {
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)

    if (!user) {
      res.status(401).json({ message: 'Usuário não encontrado.' })
      return
    }

    req.user = toPublicUser(user)
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido.' })
  }
}
