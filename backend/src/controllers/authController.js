import User from '../models/User.js'
import {
  comparePassword,
  generateToken,
  hashPassword,
  normalizeEmail,
} from '../services/authService.js'
import { toPublicUser } from '../utils/publicUser.js'

export async function register(req, res) {
  const { nome, email, senha } = req.body

  if (!nome?.trim() || !email?.trim() || !senha) {
    res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' })
    return
  }

  if (senha.length < 6) {
    res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' })
    return
  }

  const normalizedEmail = normalizeEmail(email)
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    res.status(409).json({ message: 'Email já cadastrado.' })
    return
  }

  const passwordHash = await hashPassword(senha)
  const user = await User.create({
    nome: nome.trim(),
    email: normalizedEmail,
    passwordHash,
  })

  res.status(201).json({
    user: toPublicUser(user),
    token: generateToken(user),
  })
}

export async function login(req, res) {
  const { email, senha } = req.body

  if (!email?.trim() || !senha) {
    res.status(400).json({ message: 'Email e senha são obrigatórios.' })
    return
  }

  const normalizedEmail = normalizeEmail(email)
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')

  if (!user) {
    res.status(401).json({ message: 'Credenciais inválidas.' })
    return
  }

  const isPasswordValid = await comparePassword(senha, user.passwordHash)

  if (!isPasswordValid) {
    res.status(401).json({ message: 'Credenciais inválidas.' })
    return
  }

  res.status(200).json({
    user: toPublicUser(user),
    token: generateToken(user),
  })
}

export function me(req, res) {
  res.status(200).json({ user: req.user })
}
