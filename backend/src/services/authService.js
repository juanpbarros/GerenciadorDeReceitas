import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export async function hashPassword(password) {
  return argon2.hash(password)
}

export async function comparePassword(password, passwordHash) {
  return argon2.verify(passwordHash, password)
}

export function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado.')
  }

  return process.env.JWT_SECRET
}

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: '7d',
    },
  )
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret())
}
